import { describe, expect, it } from "vitest";

import {
  mapUserLoginsDailySamples,
  userLoginsDailyPromql,
} from "../src/metrics-user-logins.js";

describe("mapUserLoginsDailySamples", () => {
  it("sums the trailing seven UTC days for active_last_7_days", () => {
    const evaluationTime = new Date("2026-09-11T12:00:00.000Z");
    const samples = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(Date.UTC(2026, 7, 13 + index));
      return {
        count: index >= 23 ? 10 : 0,
        date: date.toISOString().slice(0, 10),
      };
    });

    const metrics = mapUserLoginsDailySamples(samples, evaluationTime);

    expect(metrics.active_last_7_days).toBe(70);
    expect(metrics.active_last_30_days).toBe(70);
    expect(metrics.active_daily).toHaveLength(30);
    expect(metrics.active_daily.at(-1)).toEqual({
      count: 10,
      date: "2026-09-11",
    });
  });

  it("counts the same user on two days twice in the seven-day total", () => {
    const evaluationTime = new Date("2026-09-11T12:00:00.000Z");
    const samples = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(Date.UTC(2026, 7, 13 + index));
      const count = index === 28 || index === 29 ? 1 : 0;
      return {
        count,
        date: date.toISOString().slice(0, 10),
      };
    });

    expect(
      mapUserLoginsDailySamples(samples, evaluationTime).active_last_7_days,
    ).toBe(2);
  });

  it("fails when any day in the trailing window is missing", () => {
    expect(() =>
      mapUserLoginsDailySamples(
        [{ count: 1, date: "2026-09-11" }],
        new Date("2026-09-11T12:00:00.000Z"),
      ),
    ).toThrow("incomplete daily login series");
  });
});

describe("userLoginsDailyPromql", () => {
  it("queries the API server login gauge", () => {
    expect(userLoginsDailyPromql).toBe("hypershell_unique_user_logins_daily");
  });
});
