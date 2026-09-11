import { describe, expect, it } from "vitest";

import {
  mergeRegisteredUsersMetrics,
  userActivityStatsToRegistrationMetric,
  userLoginsToMetricFields,
} from "./user-activity-stats";

describe("userActivityStatsToRegistrationMetric", () => {
  it("maps registration stats without login fields", () => {
    expect(
      userActivityStatsToRegistrationMetric({
        registered_last_7_days: 1,
        registered_last_30_days: 3,
        registration_daily: [{ count: 1, date: "2026-09-01" }],
        total_registered: 42,
      }),
    ).toEqual({
      createdLast7Days: "1",
      createdLast30Days: "3",
      id: "registered-users",
      trend: {
        points: [{ label: "2026-09-01", value: 1 }],
      },
      value: "42",
    });
  });
});

describe("userLoginsToMetricFields", () => {
  it("maps BFF login stats into registered-users login fields", () => {
    expect(
      userLoginsToMetricFields({
        active_daily: [{ count: 2, date: "2026-09-01" }],
        active_last_7_days: 63,
        active_last_30_days: 312,
      }),
    ).toEqual({
      activeLast7Days: "63",
      activeLast30Days: "312",
      activeTrend: {
        points: [{ label: "2026-09-01", value: 2 }],
      },
      id: "registered-users",
    });
  });
});

describe("mergeRegisteredUsersMetrics", () => {
  it("merges registration and login fields into one metric", () => {
    const registration = userActivityStatsToRegistrationMetric({
      registered_last_7_days: 12,
      registered_last_30_days: 48,
      registration_daily: [],
      total_registered: 450,
    });
    const loginFields = userLoginsToMetricFields({
      active_daily: [{ count: 13, date: "2026-09-11" }],
      active_last_7_days: 186,
      active_last_30_days: 312,
    });

    expect(mergeRegisteredUsersMetrics(registration, loginFields)).toEqual({
      activeLast7Days: "186",
      activeLast30Days: "312",
      activeTrend: {
        points: [{ label: "2026-09-11", value: 13 }],
      },
      createdLast7Days: "12",
      createdLast30Days: "48",
      id: "registered-users",
      trend: {
        points: [],
      },
      value: "450",
    });
  });
});
