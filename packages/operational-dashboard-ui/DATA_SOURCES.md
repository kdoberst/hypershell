# Operational dashboard data sources

This document tracks which operational dashboard widgets are backed by live
data and which remain placeholders. Widgets without a connected source still
appear on the dashboard; they render the localized "Metric unavailable" empty
state defined in `operational-dashboard-page.tsx`.

Data is loaded through `useGetMetricsData` → `dashboard.getOperationalMetrics`
→ `components/web-console/app/adapters/api/dashboard-control-plane.ts`.

## Connected metrics

| Widget / metric ID      | Source                                                             | Notes                                                                                                                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `provisioned-gateways`  | HyperShell API `GET /api/hypershell/v1/gateways` (paginated)       | Display-status breakdown (`healthy`, `provisioning`, `degraded`, `failed`) using the same phase/status presentation rules as the gateway list. Total count. Refreshes every 15 minutes (`operationalDashboardRefreshMilliseconds`). |
| `gateway-status`        | Same as `provisioned-gateways`                                     | Uses the `status` field on the provisioned-gateways metric.                                                                                                                                                                         |
| `provisioned-sandboxes` | HyperShell API `GET /api/hypershell/v1/gateways` (paginated)       | Sum of `active_sandbox_count` across all gateways. Advisory control-plane field; omitted from the response when unset on a gateway.                                                                                                 |
| `registered-users`      | HyperShell API `GET /api/hypershell/v1/users` (`page=1`, `size=1`) | Total registered users from the List `total` field. Requires dashboard-operator authorization (`platform:admin` or `hypershell-admins`). Refreshes every 15 minutes (`operationalDashboardRefreshMilliseconds`).                    |
| `memory`                | BFF `GET /api/metrics/cluster-memory` (Prometheus)                 | Hub-cluster node memory from Prometheus node-exporter via `sum(node_memory_MemTotal_bytes)` (capacity) and `sum(node_memory_MemAvailable_bytes)` (available). Adapter maps used/capacity bytes to whole GiB for the utilization donut. Refreshes every 15 minutes (`operationalDashboardRefreshMilliseconds`). |
| `cpu`                   | BFF `GET /api/metrics/cluster-cpu` (Prometheus)                  | Hub-cluster node CPU from the same node-exporter DaemonSet as memory. Capacity: `sum(count by (instance) (node_cpu_seconds_total{mode="idle"}))`. Used: `sum(rate(node_cpu_seconds_total{mode!="idle"}[5m]))`. Adapter maps fractional used/capacity cores to whole cores for the utilization donut. Refreshes every 15 minutes (`operationalDashboardRefreshMilliseconds`). |

## Not connected (widgets remain, data unavailable)

| Widget / metric ID               | Reason                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `nodes`                          | Cluster node inventory is not scraped into the deployed Prometheus stack beyond node-exporter memory series.                |
| `pods`                           | No pod count or capacity series is available through the BFF metrics routes.                                              |
| `provision-time`                 | Gateway provisioning duration is not published as a Prometheus metric or REST aggregate.                                  |
| Sparkline trends on metric cards | Historical series are not queried; only instantaneous values are loaded.                                                  |

## Adding a new source

1. Expose a same-origin BFF route (or reuse an existing API route) for browser access.
2. Extend `createDashboardControlPlaneAdapter` to map the response into `OperationalMetric`.
3. Update this file and the dashboard page description in `messages.ts`.
