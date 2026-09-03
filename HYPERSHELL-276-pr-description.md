## Summary

Closes [HYPERSHELL-276](https://redhat.atlassian.net/browse/HYPERSHELL-276).

Adds an **Operational Dashboard** to the HyperShell web console — a widgetized fleet health overview for administrators. The dashboard is available at `/dashboard` and, on a dedicated dashboard host (`dashboard.*`), at `/`.

Access is restricted to users with the `hypershell-admins` or `platform:admin` realm role. Non-admins see a localized access-denied empty state in the SPA; the BFF redirects unauthenticated or unauthorized browser navigations away from dashboard routes.

### New package

Introduces `@openshift-online/hypershell-operational-dashboard-ui`, a reusable PatternFly widgetized-dashboard package with:

- `OperationalDashboardPage` and a default four-column layout (usage summary, gateway status donut, sandboxes, memory, CPU, pods, nodes, system summary)
- Hexagonal application boundary (`DashboardControlPlane` port, `createDashboardOperations`, workflow probes)
- Layout persistence, manual refresh, 15-minute auto-refresh, loading/error/unavailable states
- Storybook fixtures and unit tests

### Live data (v1)

| Widget | Source |
| --- | --- |
| Registered users | New `GET /api/hypershell/v1/users` API (`total` from paginated list) |
| Gateway status | Paginated `GET /api/hypershell/v1/gateways` — healthy / provisioning / degraded / failed breakdown |
| Active sandboxes | Sum of `active_sandbox_count` across gateways |
| Hub memory | BFF `GET /api/metrics/cluster-memory` (Prometheus node-exporter) |
| Hub CPU | BFF `GET /api/metrics/cluster-cpu` (Prometheus node-exporter) |
| Hub pods | BFF `GET /api/metrics/cluster-pods` (kube-state-metrics) — capacity, phases, unused |
| Hub nodes | BFF `GET /api/metrics/cluster-nodes` (kube-state-metrics) — ready vs not ready |
| Mean provision time | Gateway list — mean minutes for `Running` gateways (system summary) |

Sparkline trend charts are not wired in this story; widgets without historical series show instantaneous values only.

### Supporting changes

- **Web console BFF**: Admin role enforcement on `/dashboard` and dashboard-host `/`; four new Prometheus-backed metrics routes
- **API server**: Users list plugin and OpenAPI surface; dashboard-operator authorization for registered-user counts
- **Deploy**: kube-state-metrics and node-exporter manifests plus ServiceMonitors for hub-cluster metrics collection
- **Specs**: `specs/web-console/operational-dashboard.spec.md` plus platform specs for cluster CPU/memory/nodes/pods, registered users, and gateway provision time
- **SDK**: Regenerated TypeScript client for the users API

## Test plan

- [ ] Sign in as a user with `hypershell-admins` or `platform:admin` and open `/dashboard` — dashboard loads with live metrics
- [ ] Sign in as a non-admin user and navigate to `/dashboard` — access denied empty state; BFF redirects on direct navigation
- [ ] Verify each widget shows data (or a localized unavailable state if the backing source is down): registered users, gateway status, sandboxes, memory, CPU, pods, nodes
- [ ] Confirm manual refresh and 15-minute auto-refresh work; loading and error states render correctly
- [ ] On `dashboard.hypershell.localhost` (Kind), confirm `/` serves the operational dashboard for admins
- [ ] Run `pnpm --filter @openshift-online/hypershell-operational-dashboard-ui check`
- [ ] Run web-console BFF and adapter tests (`components/web-console/bff/test/*`, `dashboard-control-plane.test.ts`)
- [ ] Run API server users integration tests (`components/api-server/plugins/users/integration_test.go`)
