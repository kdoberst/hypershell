# User Login Metrics

**Status:** Active
**Applies to:** `components/api-server` users plugin, RBAC middleware, and Prometheus metrics collector, `deploy/base` and `deploy/kind` Prometheus scrape configuration, `components/web-console` BFF and dashboard adapter, `packages/operational-dashboard-ui`

## Purpose

Expose **human user login activity** on the operational dashboard: daily unique-login counts for the last 30 UTC calendar days, rolling 7- and 30-day totals derived as the **sum of those daily counts**, and a sparkline for the Users widget.

Login activity SHALL be sourced from **Prometheus**. Registration totals and signup windows remain on the HyperShell REST API (`platform/registered-users.spec.md` RU-09).

A **login** is the first authenticated HyperShell API request from a human user in a UTC calendar day. Repeat requests the same day by the same user SHALL NOT increment that day's count. UI (via BFF), CLI, and direct API callers SHALL all count when they reach the API server with a human-user JWT.

Service-account principals SHALL NOT count toward login metrics (ULM-02).

### Relationship to other specifications

- **Registered users** (`platform/registered-users.spec.md`) owns the `registered-users` widget, registration fields, and adapter merge rules (RU-11).
- **Operational dashboard** (`web-console/operational-dashboard.spec.md`) owns refresh policy (OP-DASH-09), independent metric sources (OP-DASH-19), and dashboard-operator BFF access (OP-DASH-04).
- **Gateway metrics dashboard** (`platform/gateway-metrics-dashboard.spec.md`) and cluster metrics specs follow the same BFF Prometheus proxy pattern used here.

### Non-Goals

- Keycloak session or OIDC login events without a subsequent HyperShell API request
- Distinct-user counts across a multi-day window (the 7/30-day totals are sums of daily uniques, not deduplicated headcount)
- Per-user login history in the dashboard UI
- Live "users online now" or concurrent session counts

## Requirements

### Requirement: ULM-01 -- Login Recording

The API server SHALL record human-user logins during JWT auto-provisioning middleware when an authenticated request maps to a provisioned `User` row.

Recording SHALL persist at most one login per `user_id` per UTC calendar day in the `user_login_days` table. The middleware SHALL update `last_login_at` on the `User` record when recording occurs.

Service-account principals excluded by ULM-02 SHALL NOT create `user_login_days` rows or increment Prometheus login metrics.

#### Scenario: First request of the day records a login

- GIVEN human user `alice` authenticated on `2026-09-11T09:00:00Z`
- AND `alice` has no `user_login_days` row for `2026-09-11`
- WHEN `alice` sends an authenticated API request that passes auto-provisioning
- THEN the API server SHALL insert one `user_login_days` row for `alice` on `2026-09-11`

#### Scenario: Second request the same UTC day does not double-count

- GIVEN human user `alice` already has a `user_login_days` row for `2026-09-11`
- WHEN `alice` sends another authenticated API request on `2026-09-11T15:00:00Z`
- THEN the API server SHALL NOT insert a second row for that user and date

---

### Requirement: ULM-02 -- Service Account Exclusion

Login recording and login metrics SHALL include only **human users** with provisioned `User` records.

JWT principals whose `preferred_username` matches the API-server configured service-account allowlist (`pkg/rbac` service-account guard) SHALL be excluded. Other machine principals that do not map to a provisioned `User` SHALL also be excluded.

#### Scenario: Control-plane service account does not count as a login

- GIVEN the control-plane service account is on the API-server service-account allowlist
- WHEN that principal sends authenticated API requests on three UTC days
- THEN `user_login_days` SHALL contain zero rows for that principal
- AND Prometheus `hypershell_unique_user_logins_daily` SHALL NOT increase because of those requests

---

### Requirement: ULM-03 -- Prometheus Daily Login Gauge

The API server SHALL expose a custom Prometheus collector that emits `hypershell_unique_user_logins_daily` as a **Gauge** with label `date` (`YYYY-MM-DD`, UTC).

On each scrape, the collector SHALL emit one sample per UTC calendar day covering the trailing 30-day window ending on the evaluation day (inclusive). Each value SHALL equal the count of distinct human `user_id` values in `user_login_days` for that `date` label, excluding service accounts per ULM-02.

Days with zero logins SHALL still be emitted with value `0`.

When the backing query fails, the collector SHALL emit `prometheus.NewInvalidMetric` so the scrape registers as failed.

The collector SHALL be registered exactly once using `sync.Once`; subsequent calls SHALL be no-ops.

#### Scenario: Thirty daily samples on every scrape

- GIVEN today is `2026-09-11` UTC
- WHEN Prometheus scrapes `GET :4433/metrics`
- THEN the response SHALL include `hypershell_unique_user_logins_daily{date="2026-08-13"}` through `hypershell_unique_user_logins_daily{date="2026-09-11"}`
- AND exactly 30 `date` label values SHALL be present

#### Scenario: Zero-login day is explicit

- GIVEN no human user logged in on `2026-09-05` UTC
- WHEN Prometheus scrapes the metrics endpoint
- THEN `hypershell_unique_user_logins_daily{date="2026-09-05"}` SHALL be present with value `0`

---

### Requirement: ULM-04 -- Prometheus Data Source

Login activity exposed to the dashboard SHALL be derived from Prometheus instant queries executed by the web-console BFF against `PROMETHEUS_URL` (same configuration as `platform/cluster-memory.spec.md` CM-03).

The BFF SHALL evaluate:

```promql
hypershell_unique_user_logins_daily
```

at a single evaluation timestamp and SHALL read the trailing 30 `date` label values in chronological order.

The BFF SHALL compute:

| Output field | Rule |
| --- | --- |
| `active_daily[]` | One `{date, count}` entry per day in the 30-day window; `count` is the gauge value (integer) |
| `active_last_7_days` | Sum of `count` over the last 7 UTC calendar days in the window (inclusive of evaluation day) |
| `active_last_30_days` | Sum of `count` over all 30 UTC calendar days in the window |

All day boundaries SHALL use UTC midnight per RU-09 registration windows.

The BFF SHALL NOT contact the HyperShell REST API for login counts.

#### Scenario: Seven-day total is sum of daily counts

- GIVEN `active_daily` for the last seven UTC days is `[10, 12, 0, 8, 9, 11, 13]`
- WHEN the BFF maps the response
- THEN `active_last_7_days` SHALL be `63`

#### Scenario: Same user on two days contributes twice to the seven-day total

- GIVEN human user `alice` logged in only on Monday and Tuesday of the window
- AND each of those days has `count: 1` in `active_daily`
- THEN `active_last_7_days` SHALL include `2` from `alice` (not `1`)

---

### Requirement: ULM-05 -- BFF User Logins Route

The web-console BFF SHALL expose `GET /api/metrics/user-logins` as a same-origin route that:

1. Requires dashboard-operator authorization when OIDC is enabled (same policy as `GET /api/metrics/cluster-memory` per OP-DASH-04)
2. Executes the Prometheus instant query in ULM-04
3. Returns JSON:

```json
{
  "active_last_7_days": 186,
  "active_last_30_days": 312,
  "active_daily": [
    { "date": "2026-08-13", "count": 98 },
    { "date": "2026-08-14", "count": 101 }
  ]
}
```

`active_daily` SHALL contain exactly 30 elements ordered by ascending `date`.

The route SHALL NOT forward to the HyperShell API server and SHALL NOT require a HyperShell API bearer token.

On Prometheus failure, timeout, non-success Prometheus response status, missing series, or fewer than 30 daily samples, the BFF SHALL respond with HTTP `502` and `{ "error": "Metrics unavailable", "statusCode": 502 }`. The BFF SHALL NOT return zeroed login figures as a fallback.

#### Scenario: Dashboard administrator receives login stats

- GIVEN OIDC is enabled and the caller has `hypershell-admins`
- AND Prometheus returns 30 `hypershell_unique_user_logins_daily` samples
- WHEN the caller sends `GET /api/metrics/user-logins`
- THEN the BFF SHALL respond with HTTP `200` and the ULM-05 JSON body

#### Scenario: Non-admin receives forbidden

- GIVEN OIDC is enabled and the caller has only `hypershell-users`
- WHEN the caller sends `GET /api/metrics/user-logins`
- THEN the BFF SHALL respond with HTTP `403`

---

### Requirement: ULM-06 -- Operational Dashboard Adapter Mapping

The operational dashboard host adapter SHALL fetch `GET /api/metrics/user-logins` as an independent metric source (OP-DASH-19) and SHALL merge the result into the `registered-users` `OperationalMetric` per `platform/registered-users.spec.md` RU-11.

| Metric field | BFF field |
| --- | --- |
| `activeLast7Days` | `active_last_7_days` (decimal string) |
| `activeLast30Days` | `active_last_30_days` (decimal string) |
| `activeTrend` | `active_daily` mapped to `OperationalMetricTrend` (`label` = `date`, `value` = `count`) |

The adapter SHALL NOT populate `activeLast7Days`, `activeLast30Days`, or `activeTrend` from `GET /api/hypershell/v1/users/stats`.

#### Scenario: Adapter maps Prometheus login series

- GIVEN the BFF returns `active_last_7_days: 63` and 30 `active_daily` points
- WHEN the adapter builds `registered-users`
- THEN `activeLast7Days` SHALL be `"63"`
- AND `activeTrend.points` SHALL contain 30 entries in date order

---

### Requirement: ULM-07 -- Usage Summary Trend Arrow

The usage summary **Users** row SHALL derive its trend direction indicator from `activeTrend` on the merged `registered-users` metric using the rules in RU-10 (first vs last point in the 30-day series, visible only when change is at least 5%).

#### Scenario: Trend arrow follows sparkline endpoints

- GIVEN `activeTrend` first point value `98` and last point value `190`
- WHEN the usage summary Users row renders
- THEN it SHALL show an increase indicator with approximately `94%` in the tooltip

---

### Requirement: ULM-08 -- Refresh, Failure, and Retention

Login metrics SHALL inherit the operational dashboard refresh policy (`operationalDashboardRefreshMilliseconds`, currently 15 minutes) via the shared metrics query (OP-DASH-09).

A failed `GET /api/metrics/user-logins` request SHALL fail only the login portion of the `registered-users` metric assembly (RU-11). The dashboard SHALL NOT display `0` as a fallback login count.

Prometheus retention SHALL be at least 30 days so the trailing window is available in production. Kind and base deploy manifests SHALL configure retention accordingly or document the minimum operator requirement.

#### Scenario: Prometheus outage omits login fields

- GIVEN registration stats loaded successfully from `GET /api/hypershell/v1/users/stats`
- AND `GET /api/metrics/user-logins` returns HTTP `502`
- WHEN the dashboard renders the Users widget
- THEN registration total and Added rows SHALL display
- AND Unique logins rows, sparkline, and usage-summary trend arrow SHALL use the metric-unavailable state

---

### Requirement: ULM-09 -- Verification

The API server SHALL include integration tests for:

- Human-user login recording and same-day deduplication
- Service-account exclusion from `user_login_days`
- Prometheus collector emission of 30 daily gauges including zero-valued days

The web-console BFF SHALL include unit tests for PromQL evaluation, 7/30-day summation, and HTTP `502` on Prometheus errors.

The dashboard adapter SHALL include unit tests merging BFF login stats into `registered-users`.

`DATA_SOURCES.md` SHALL document `GET /api/metrics/user-logins` as the login-activity source for `registered-users`.

#### Scenario: CI covers recording and adapter merge

- GIVEN the integration and unit test suites run in CI
- WHEN user login metrics tests execute
- THEN they SHALL cover allow and deny paths for BFF authorization
- AND adapter tests SHALL assert sum-of-daily mapping for `activeLast7Days`
