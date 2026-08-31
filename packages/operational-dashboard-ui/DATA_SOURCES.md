# Operational dashboard data sources

This document tracks which operational dashboard widgets are backed by live
data and which remain placeholders. Widgets without a connected source still
appear on the dashboard; they render the localized "Metric unavailable" empty
state defined in `operational-dashboard-page.tsx`.

Data is loaded through `useGetMetricsData` → `dashboard.getOperationalMetrics`
→ `components/web-console/app/adapters/api/dashboard-control-plane.ts`.

## Connected metrics

| Widget / metric ID      | Source                                                       | Notes                                                                                                                                                                                                                               |
| ----------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `provisioned-gateways`  | HyperShell API `GET /api/hypershell/v1/gateways` (paginated) | Display-status breakdown (`healthy`, `provisioning`, `degraded`, `failed`) using the same phase/status presentation rules as the gateway list. Total count. Refreshes every 15 minutes (`operationalDashboardRefreshMilliseconds`). |
| `gateway-status`        | Same as `provisioned-gateways`                               | Uses the `status` field on the provisioned-gateways metric.                                                                                                                                                                         |
| `provisioned-sandboxes` | HyperShell API `GET /api/hypershell/v1/gateways` (paginated) | Sum of `active_sandbox_count` across all gateways. Advisory control-plane field; omitted from the response when unset on a gateway.                                                                                                 |

## Not connected (widgets remain, data unavailable)

| Widget / metric ID               | Reason                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `active-users`                   | No authenticated-user or session-count metric is exposed to the web console today.                                        |
| `nodes`                          | Cluster node inventory is not scraped into the deployed Prometheus stack (only `hypershell_gateways_total` is collected). |
| `cpu`                            | No cluster CPU capacity or utilization series is available through the BFF metrics routes.                                |
| `memory`                         | No cluster memory capacity or utilization series is available through the BFF metrics routes.                             |
| `pods`                           | No pod count or capacity series is available through the BFF metrics routes.                                              |
| `provision-time`                 | Gateway provisioning duration is not published as a Prometheus metric or REST aggregate.                                  |
| Sparkline trends on metric cards | Historical series are not queried; only instantaneous values are loaded.                                                  |

## Adding a new source

1. Expose a same-origin BFF route (or reuse an existing API route) for browser access.
2. Extend `createDashboardControlPlaneAdapter` to map the response into `OperationalMetric`.
3. Update this file and the dashboard page description in `messages.ts`.
