import { describe, expect, it } from "vitest";

import type { OperationalDashboardMetrics } from "../application/dashboard-types";
import { mergeOperationalDashboardMetrics } from "./dashboard-metric-sources";

const previousMetrics: OperationalDashboardMetrics = {
  lastSuccessfulRefresh: new Date("2026-08-25T10:00:00.000Z"),
  metrics: [
    { id: "provisioned-gateways", value: "10" },
    { id: "memory", total: "32", unit: "GiB", value: "16" },
  ],
};

describe("mergeOperationalDashboardMetrics", () => {
  it("returns the next payload when there is no previous data", () => {
    const next: OperationalDashboardMetrics = {
      failedSources: ["cluster-memory"],
      lastSuccessfulRefresh: new Date("2026-08-25T11:00:00.000Z"),
      metrics: [{ id: "provisioned-gateways", value: "12" }],
    };

    expect(mergeOperationalDashboardMetrics(undefined, next)).toEqual(next);
  });

  it("preserves stale metrics for failed sources on refresh", () => {
    const next: OperationalDashboardMetrics = {
      failedSources: ["cluster-memory"],
      lastSuccessfulRefresh: new Date("2026-08-25T11:00:00.000Z"),
      metrics: [{ id: "provisioned-gateways", value: "12" }],
    };

    expect(mergeOperationalDashboardMetrics(previousMetrics, next)).toEqual({
      failedSources: ["cluster-memory"],
      lastSuccessfulRefresh: next.lastSuccessfulRefresh,
      metrics: [
        { id: "provisioned-gateways", value: "12" },
        { id: "memory", total: "32", unit: "GiB", value: "16" },
      ],
    });
  });

  it("returns the next payload unchanged when no sources failed", () => {
    const next: OperationalDashboardMetrics = {
      lastSuccessfulRefresh: new Date("2026-08-25T11:00:00.000Z"),
      metrics: [
        { id: "provisioned-gateways", value: "12" },
        { id: "memory", total: "64", unit: "GiB", value: "20" },
      ],
    };

    expect(mergeOperationalDashboardMetrics(previousMetrics, next)).toEqual(
      next,
    );
  });

  it("preserves stale registered-users login fields when user-logins fails on refresh", () => {
    const previous: OperationalDashboardMetrics = {
      lastSuccessfulRefresh: new Date("2026-08-25T10:00:00.000Z"),
      metrics: [
        {
          activeLast7Days: "186",
          activeLast30Days: "312",
          activeTrend: {
            points: [{ label: "2026-09-11", value: 13 }],
          },
          createdLast7Days: "10",
          createdLast30Days: "40",
          id: "registered-users",
          value: "440",
        },
      ],
    };
    const next: OperationalDashboardMetrics = {
      failedSources: ["user-logins"],
      lastSuccessfulRefresh: new Date("2026-08-25T11:00:00.000Z"),
      metrics: [
        {
          createdLast7Days: "12",
          createdLast30Days: "48",
          id: "registered-users",
          value: "450",
        },
      ],
    };

    expect(mergeOperationalDashboardMetrics(previous, next)).toEqual({
      failedSources: ["user-logins"],
      lastSuccessfulRefresh: next.lastSuccessfulRefresh,
      metrics: [
        {
          activeLast7Days: "186",
          activeLast30Days: "312",
          activeTrend: {
            points: [{ label: "2026-09-11", value: 13 }],
          },
          createdLast7Days: "12",
          createdLast30Days: "48",
          id: "registered-users",
          value: "450",
        },
      ],
    });
  });
});
