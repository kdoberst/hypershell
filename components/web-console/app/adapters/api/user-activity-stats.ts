import type {
  OperationalMetric,
  OperationalMetricTrend,
} from "@openshift-online/hypershell-operational-dashboard-ui";
import type {
  UserActivityStats,
  UserDailyCount,
} from "@openshift-online/hypershell-sdk";

function dailyCountsToTrend(
  daily: readonly UserDailyCount[],
): OperationalMetricTrend {
  return {
    points: daily.map((point) => ({
      label: point.date,
      value: point.count,
    })),
  };
}

export function userActivityStatsToRegistrationMetric(
  stats: UserActivityStats,
): OperationalMetric {
  return {
    createdLast7Days: String(stats.registered_last_7_days),
    createdLast30Days: String(stats.registered_last_30_days),
    id: "registered-users",
    trend: dailyCountsToTrend(stats.registration_daily),
    value: String(stats.total_registered),
  };
}

export interface UserLoginsMetricsResponse {
  active_daily: readonly { count: number; date: string }[];
  active_last_7_days: number;
  active_last_30_days: number;
}

export interface RegisteredUsersLoginMetricFields {
  activeLast7Days: string;
  activeLast30Days: string;
  activeTrend: OperationalMetricTrend;
  id: "registered-users";
}

export function userLoginsToMetricFields(
  stats: UserLoginsMetricsResponse,
): RegisteredUsersLoginMetricFields {
  return {
    activeLast7Days: String(stats.active_last_7_days),
    activeLast30Days: String(stats.active_last_30_days),
    activeTrend: {
      points: stats.active_daily.map((point) => ({
        label: point.date,
        value: point.count,
      })),
    },
    id: "registered-users",
  };
}

export function mergeRegisteredUsersMetrics(
  registration: OperationalMetric,
  loginFields: RegisteredUsersLoginMetricFields,
): OperationalMetric {
  return {
    ...registration,
    activeLast7Days: loginFields.activeLast7Days,
    activeLast30Days: loginFields.activeLast30Days,
    activeTrend: loginFields.activeTrend,
  };
}

/** @deprecated Use userActivityStatsToRegistrationMetric and userLoginsToMetricFields. */
export function userActivityStatsToMetric(
  stats: UserActivityStats,
): OperationalMetric {
  return userActivityStatsToRegistrationMetric(stats);
}
