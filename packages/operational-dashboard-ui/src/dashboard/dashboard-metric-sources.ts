import type {
  DashboardMetricSourceId,
  OperationalDashboardMetrics,
  OperationalMetric,
} from "../application/dashboard-types";

export const DASHBOARD_METRIC_SOURCE_METRIC_IDS: Readonly<
  Record<DashboardMetricSourceId, readonly string[]>
> = {
  "gateway-metrics": [
    "provisioned-gateways",
    "provisioned-sandboxes",
    "provision-time",
  ],
  "user-registration-stats": ["registered-users"],
  "user-logins": ["registered-users"],
  "platform-inventory": ["managed-clusters", "managed-databases"],
  "cluster-memory": ["memory"],
  "cluster-cpu": ["cpu"],
  "cluster-pods": ["pods"],
  "cluster-nodes": ["nodes"],
};

function preserveRegisteredUsersLoginFields(
  previous: OperationalMetric,
  next: OperationalMetric,
): OperationalMetric {
  return {
    ...next,
    activeLast7Days: next.activeLast7Days ?? previous.activeLast7Days,
    activeLast30Days: next.activeLast30Days ?? previous.activeLast30Days,
    activeTrend: next.activeTrend ?? previous.activeTrend,
  };
}

export function mergeOperationalDashboardMetrics(
  previous: OperationalDashboardMetrics | undefined,
  next: OperationalDashboardMetrics,
): OperationalDashboardMetrics {
  if (
    previous === undefined ||
    next.failedSources === undefined ||
    next.failedSources.length === 0
  ) {
    return next;
  }

  const mergedById = new Map(next.metrics.map((metric) => [metric.id, metric]));
  const staleMetricIds = new Set(
    next.failedSources.flatMap(
      (sourceId) => DASHBOARD_METRIC_SOURCE_METRIC_IDS[sourceId],
    ),
  );

  for (const metric of previous.metrics) {
    if (staleMetricIds.has(metric.id) && !mergedById.has(metric.id)) {
      mergedById.set(metric.id, metric);
      continue;
    }

    if (
      metric.id === "registered-users" &&
      next.failedSources.includes("user-logins")
    ) {
      const refreshed = mergedById.get("registered-users");
      if (refreshed !== undefined) {
        mergedById.set(
          "registered-users",
          preserveRegisteredUsersLoginFields(metric, refreshed),
        );
      }
    }
  }

  return {
    ...next,
    metrics: [...mergedById.values()],
  };
}
