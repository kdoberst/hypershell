export const userLoginsDailyPromql = "hypershell_unique_user_logins_daily";

export interface UserLoginDailyCount {
  count: number;
  date: string;
}

export interface UserLoginsMetrics {
  active_daily: UserLoginDailyCount[];
  active_last_7_days: number;
  active_last_30_days: number;
}

interface PrometheusQueryResponse {
  status: string;
  data?: {
    result: {
      metric: { date?: string };
      value: [string, string];
    }[];
  };
}

const lookbackDays = 30;
const sevenDayWindow = 7;

function utcDayStart(value: Date): Date {
  return new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
  );
}

function formatUtcDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function buildTrailingUtcDates(evaluationTime: Date): string[] {
  const endDay = utcDayStart(evaluationTime);
  const startDay = new Date(endDay);
  startDay.setUTCDate(startDay.getUTCDate() - (lookbackDays - 1));

  const dates: string[] = [];
  for (
    let day = startDay;
    day.getTime() <= endDay.getTime();
    day = new Date(day.getTime() + 86_400_000)
  ) {
    dates.push(formatUtcDate(day));
  }
  return dates;
}

function sumDailyCounts(values: readonly number[]): number {
  return values.reduce((total, count) => total + count, 0);
}

export function mapUserLoginsDailySamples(
  samples: readonly { date: string; count: number }[],
  evaluationTime: Date = new Date(),
): UserLoginsMetrics {
  const expectedDates = buildTrailingUtcDates(evaluationTime);
  const countsByDate = new Map(
    samples.map((sample) => [sample.date, sample.count]),
  );

  const active_daily: UserLoginDailyCount[] = [];
  for (const date of expectedDates) {
    const count = countsByDate.get(date);
    if (count === undefined) {
      throw new Error(
        "Prometheus query returned incomplete daily login series",
      );
    }
    active_daily.push({ count, date });
  }

  const lastSevenCounts = active_daily
    .slice(active_daily.length - sevenDayWindow)
    .map((point) => point.count);

  return {
    active_daily,
    active_last_7_days: sumDailyCounts(lastSevenCounts),
    active_last_30_days: sumDailyCounts(
      active_daily.map((point) => point.count),
    ),
  };
}

export async function queryUserLogins(
  prometheusUrl: string,
  timeoutMs: number,
  evaluationTime: Date = new Date(),
): Promise<UserLoginsMetrics> {
  const queryUrl = new URL("/api/v1/query", prometheusUrl);
  queryUrl.searchParams.set("query", userLoginsDailyPromql);

  const controller = new AbortController();
  const timeoutReason = new Error("Prometheus query timed out");
  const timeout = setTimeout(() => {
    controller.abort(timeoutReason);
  }, timeoutMs);

  try {
    const response = await fetch(queryUrl, { signal: controller.signal });
    if (!response.ok) {
      throw new Error("Prometheus query request failed");
    }

    const body = (await response.json()) as PrometheusQueryResponse;
    if (body.status !== "success") {
      throw new Error("Prometheus query returned non-success status");
    }

    const samples: { count: number; date: string }[] = [];
    for (const sample of body.data?.result ?? []) {
      const date = sample.metric.date;
      const rawValue = sample.value[1];
      if (date === undefined) {
        continue;
      }
      const count = Number(rawValue);
      if (!Number.isFinite(count) || count < 0) {
        throw new Error("Prometheus query returned invalid sample");
      }
      samples.push({ count: Math.round(count), date });
    }

    if (samples.length === 0) {
      throw new Error("Prometheus query returned no daily login samples");
    }

    return mapUserLoginsDailySamples(samples, evaluationTime);
  } finally {
    clearTimeout(timeout);
  }
}
