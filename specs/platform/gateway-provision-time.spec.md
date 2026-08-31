# Gateway Provision Time

**Status:** Active
**Applies to:** `components/api-server` gateway list API, `components/web-console` dashboard adapter, `packages/operational-dashboard-ui`

## Purpose

Expose **average gateway provision duration** on the operational dashboard so dashboard operators can see how long it typically takes for gateways in the fleet to reach the `Running` phase.

This is **HyperShell application telemetry** derived from gateway lifecycle timestamps on the API server, not cluster infrastructure metrics. It reflects provisioned gateways visible to the dashboard operator through the existing paginated gateway list (same RBAC scope as `provisioned-gateways`). It is **not** per-gateway SLA tracking, historical trend analysis, or control-plane reconcile latency in isolation.

Provision-time semantics for version 1:

| Concept | Meaning |
| --- | --- |
| **Sample** | One gateway in `Running` phase with parseable `created_at` and `updated_at` timestamps |
| **Duration** | `updated_at - created_at` for that gateway (proxy for provision completion; see GPT-03) |
| **Aggregate** | Arithmetic mean of sample durations across all in-scope Running gateways |

The operational dashboard `system-summary` row already renders a `provision-time` placeholder (OP-DASH-13). Version 1 connects that row to live data computed in the dashboard adapter from the gateway list. There is no standalone `provision-time` widget in the default layout.

### Relationship to other specifications

- **Operational dashboard** (`web-console/operational-dashboard.spec.md`) owns the `provision-time` system-summary row, refresh policy (OP-DASH-09), and dashboard-operator access (OP-DASH-04).
- **Provisioned gateways** (`web-console/operational-dashboard.spec.md` OP-DASH-06, OP-DASH-07) uses the same paginated gateway list fetch; provision time SHALL be computed from that aggregate pass without a second list request.
- **Provisioned sandboxes** (`platform/openshell-gateway-sandbox-count.spec.md`) sums `active_sandbox_count` from the same list; unrelated to duration.
- **Cluster memory/CPU/pods/nodes** specs source Prometheus via the BFF; provision time does not.
- **Gateway metrics dashboard** (`platform/gateway-metrics-dashboard.spec.md`) exposes Prometheus phase counts, not provision duration.

Historical trend series and per-gateway duration breakdown are out of scope for this spec (see Non-Goals).

## Requirements

### Requirement: GPT-01 -- Dashboard Operator Scope

Provision-time metrics SHALL aggregate only gateways returned by the dashboard adapter's authorized, paginated `GET /api/hypershell/v1/gateways` list (OP-DASH-06).

The metric SHALL respect the same RBAC visibility rules as `provisioned-gateways`. Gateways the caller cannot list SHALL NOT contribute samples.

The metric SHALL NOT include managed clusters, sandboxes, or nodes outside the gateway list.

#### Scenario: Operator sees fleet-wide average from visible gateways

- GIVEN a dashboard operator can list 10 gateways across two pages
- WHEN operational metrics load successfully
- THEN the provision-time aggregate SHALL consider only those 10 gateways
- AND gateways outside the caller's visibility SHALL NOT affect the average

---

### Requirement: GPT-02 -- Provision Duration Measurement Contract

For each gateway sample, the platform SHALL compute a non-negative duration in **milliseconds**:

| Field | Definition |
| --- | --- |
| `duration_ms` | `updated_at - created_at` (epoch milliseconds) for a gateway in `Running` phase |

The adapter SHALL compute one aggregate value:

| Field | Definition |
| --- | --- |
| `average_minutes` | Arithmetic mean of `duration_ms` across all samples, converted to minutes |

The adapter SHALL expose the aggregate on the `provision-time` `OperationalMetric` as:

| Field | Value |
| --- | --- |
| `value` | Decimal string of `average_minutes` rounded to **two** fractional digits |
| `unit` | `"minutes"` |

Version 1 SHALL NOT emit `total`, `status`, or `trend` on the `provision-time` metric.

Gateways whose `phase` is not exactly `Running` SHALL be excluded from samples. Gateways missing `created_at` or `updated_at`, or whose timestamps are unparseable, SHALL be excluded. Gateways where `updated_at` precedes `created_at` SHALL be excluded.

When no qualifying samples exist after scanning the full gateway list, collection SHALL fail (GPT-07).

#### Scenario: Two Running gateways average to five and a quarter minutes

- GIVEN gateway A has `phase: "Running"`, `created_at` at T0, and `updated_at` at T0 + 4 minutes
- AND gateway B has `phase: "Running"`, `created_at` at T0, and `updated_at` at T0 + 6.5 minutes
- WHEN the adapter computes provision time
- THEN `average_minutes` SHALL be `5.25`
- AND the `provision-time` metric SHALL have `value: "5.25"` and `unit: "minutes"`

---

### Requirement: GPT-03 -- Timestamp Proxy Semantics

Version 1 SHALL treat `updated_at` as the provision-completion timestamp for gateways in `Running` phase.

The API server updates `updated_at` when gateway records change; for most successfully provisioned gateways this approximates the last lifecycle transition before or at `Running`. The dashboard SHALL NOT contact the control plane or Kubernetes directly for timing data.

`DATA_SOURCES.md` SHALL document that v1 uses `updated_at - created_at` as a **proxy** and that per-gateway duration breakdown is deferred.

#### Scenario: Provisioning gateway excluded from average

- GIVEN a gateway has `phase: "Provisioning"`
- WHEN the adapter scans the gateway list
- THEN that gateway SHALL NOT contribute a duration sample
- AND it SHALL NOT count as a zero-minute sample

---

### Requirement: GPT-04 -- No Dedicated BFF or Prometheus Route

Version 1 SHALL NOT add a BFF metrics route or Prometheus query for provision time.

The dashboard adapter SHALL derive provision time from gateway list items already fetched for `provisioned-gateways` and `provisioned-sandboxes`.

#### Scenario: Single gateway list drives sandboxes and provision time

- GIVEN the adapter paginates the gateway list once per `getOperationalMetrics` call
- WHEN metrics are assembled
- THEN `provisioned-sandboxes` and `provision-time` SHALL both use that same list result
- AND the adapter SHALL NOT issue a second gateway list solely for provision time

---

### Requirement: GPT-05 -- Operational Dashboard Metric Mapping

The operational dashboard host adapter (`createDashboardControlPlaneAdapter`) SHALL emit a `provision-time` `OperationalMetric` per GPT-02 after a successful gateway list aggregate.

The `system-summary` card SHALL source its provision-time row from this metric (OP-DASH-13). Because `total` is absent, the row SHALL render the value with unit label (not a utilization donut).

#### Scenario: System summary shows minutes label

- GIVEN `average_minutes` is `5.25`
- WHEN the system-summary provision-time row renders
- THEN the operator SHALL see the localized minutes presentation for `5.25`

---

### Requirement: GPT-06 -- List Consistency Guard

Provision-time computation SHALL run only after the gateway list pagination guard in OP-DASH-06 succeeds.

If the gateway list response is inconsistent (page/total/items mismatch), the adapter SHALL throw before emitting `provision-time`.

#### Scenario: Inconsistent gateway list blocks provision time

- GIVEN the gateway list API returns `page: 2` for a `page: 1` request
- WHEN `getOperationalMetrics` runs
- THEN the adapter SHALL throw a list inconsistency error
- AND `provision-time` SHALL NOT be emitted

---

### Requirement: GPT-07 -- Refresh and Error Semantics

Provision time SHALL load through the existing operational dashboard metrics query (`useGetMetricsData`) and SHALL inherit its refresh policy (`operationalDashboardRefreshMilliseconds`, currently 15 minutes) and manual refresh behavior (OP-DASH-09).

When no qualifying Running gateway samples exist, or gateway list pagination fails, `getOperationalMetrics` SHALL fail. The dashboard SHALL NOT display `0` minutes as a fallback.

#### Scenario: No Running gateways fails metrics load

- GIVEN the authorized gateway list contains only `Provisioning` or `Failed` gateways
- WHEN the operator opens `/dashboard`
- THEN the dashboard SHALL show its localized load-error state
- AND the provision-time row SHALL NOT silently show zero

---

### Requirement: GPT-08 -- Verification

The web console SHALL include unit tests for:

- Average duration mapping from mocked gateway list items with `created_at` / `updated_at`
- Exclusion of non-`Running` gateways and invalid timestamps
- Failure when no samples qualify
- Co-use of the same paginated list as sandboxes (no extra list calls)

The operational dashboard package SHALL update `mockOperationalDashboardMetrics` only as needed for Storybook fixtures.

#### Scenario: CI exercises adapter mapping

- GIVEN mocked gateway list items yielding an average of `5.25` minutes
- WHEN dashboard adapter unit tests run
- THEN they SHALL assert the `provision-time` metric `id`, `value: "5.25"`, and `unit: "minutes"`

## Non-Goals

- Per-gateway provision duration in the UI or API
- Historical trend / sparkline for provision time in version 1
- Prometheus histograms or a new API aggregate endpoint in version 1
- Median, p95, or percentile aggregates in version 1 (mean only)
- Persisting a dedicated `provisioned_at` timestamp on the Gateway resource in version 1
- Including `Degraded` gateways in samples (only `Running` in v1)
- Cluster infrastructure metrics (see cluster memory/CPU/pods/nodes specs)
