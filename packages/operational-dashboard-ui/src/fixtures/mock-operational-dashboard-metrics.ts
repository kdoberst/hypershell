import type { OperationalDashboardMetrics } from "../application/dashboard-types";

export const mockOperationalDashboardMetrics: OperationalDashboardMetrics =
  Object.freeze({
    metrics: Object.freeze([
      Object.freeze({
        id: "registered-users",
        value: "450",
      }),
      Object.freeze({
        id: "provisioned-gateways",
        status: Object.freeze({
          degraded: 6,
          failed: 2,
          healthy: 80,
          provisioning: 9,
        }),
        trend: Object.freeze({
          points: Object.freeze([
            Object.freeze({ label: "Day 1", value: 94 }),
            Object.freeze({ label: "Day 2", value: 84 }),
            Object.freeze({ label: "Day 3", value: 85 }),
            Object.freeze({ label: "Day 4", value: 89 }),
            Object.freeze({ label: "Day 5", value: 90 }),
            Object.freeze({ label: "Day 6", value: 93 }),
            Object.freeze({ label: "Day 7", value: 97 }),
          ]),
        }),
        value: "97",
      }),
      Object.freeze({
        id: "provisioned-sandboxes",
        trend: Object.freeze({
          points: Object.freeze([
            Object.freeze({ label: "Day 1", value: 176 }),
            Object.freeze({ label: "Day 2", value: 182 }),
            Object.freeze({ label: "Day 3", value: 189 }),
            Object.freeze({ label: "Day 4", value: 194 }),
            Object.freeze({ label: "Day 5", value: 201 }),
            Object.freeze({ label: "Day 6", value: 207 }),
            Object.freeze({ label: "Day 7", value: 214 }),
          ]),
        }),
        value: "214",
      }),
      Object.freeze({
        id: "nodes",
        status: Object.freeze({
          failed: 0,
          healthy: 8,
        }),
        value: "8",
      }),
      Object.freeze({
        id: "cpu",
        value: "48",
        unit: "cores",
        total: "60",
      }),
      Object.freeze({
        id: "memory",
        value: "220",
        unit: "GiB",
        total: "237",
      }),
      Object.freeze({
        id: "pods",
        podPhases: Object.freeze({
          failed: 16,
          pending: 12,
          running: 500,
          succeeded: 20,
          unknown: 0,
        }),
        total: "2000",
        unit: "pods",
        value: "548",
      }),
      Object.freeze({
        id: "provision-time",
        value: "5.25",
        unit: "minutes",
      }),
    ]),
    lastSuccessfulRefresh: new Date("2026-08-25T10:55:00.000Z"),
  });
