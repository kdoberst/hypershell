import type { OperationalDashboardMetrics } from "../application/dashboard-types";

export const mockOperationalDashboardMetrics: OperationalDashboardMetrics =
  Object.freeze({
    metrics: Object.freeze([
      Object.freeze({
        id: "active-users",
        trend: Object.freeze({
          points: Object.freeze([
            Object.freeze({ label: "Day 1", value: 521 }),
            Object.freeze({ label: "Day 2", value: 544 }),
            Object.freeze({ label: "Day 3", value: 553 }),
            Object.freeze({ label: "Day 4", value: 578 }),
            Object.freeze({ label: "Day 5", value: 590 }),
            Object.freeze({ label: "Day 6", value: 601 }),
            Object.freeze({ label: "Day 7", value: 612 }),
          ]),
        }),
        value: "612",
      }),
      Object.freeze({
        id: "provisioned-gateways",
        trend: Object.freeze({
          points: Object.freeze([
            Object.freeze({ label: "Day 1", value: 82 }),
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
        id: "namespaces",
        trend: Object.freeze({
          points: Object.freeze([
            Object.freeze({ label: "Day 1", value: 12 }),
            Object.freeze({ label: "Day 2", value: 18 }),
            Object.freeze({ label: "Day 3", value: 20 }),
            Object.freeze({ label: "Day 4", value: 27 }),
            Object.freeze({ label: "Day 5", value: 55 }),
            Object.freeze({ label: "Day 6", value: 74 }),
            Object.freeze({ label: "Day 7", value: 80 }),
          ]),
        }),
        value: "80",
      }),
      Object.freeze({
        id: "nodes",
        value: "8",
      }),
      Object.freeze({
        id: "cpu",
        value: "4.2",
        unit: "cores",
        total: "60",
      }),
      Object.freeze({
        id: "memory",
        value: "92.3",
        unit: "GiB",
        total: "237",
      }),
      Object.freeze({
        id: "pods",
        value: "548",
        total: "2000",
        unit: "pods",
        trend: Object.freeze({
          points: Object.freeze([
            Object.freeze({ label: "Day 1", value: 124 }),
            Object.freeze({ label: "Day 2", value: 182 }),
            Object.freeze({ label: "Day 3", value: 301 }),
            Object.freeze({ label: "Day 4", value: 361 }),
            Object.freeze({ label: "Day 5", value: 449 }),
            Object.freeze({ label: "Day 6", value: 525 }),
            Object.freeze({ label: "Day 7", value: 538 }),
          ]),
        }),
      }),
    ]),
    lastSuccessfulRefresh: new Date("2026-08-25T10:55:00.000Z"),
  });
