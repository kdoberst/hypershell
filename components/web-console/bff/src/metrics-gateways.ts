export const gatewayMetricPhases = [
  "Running",
  "Provisioning",
  "Degraded",
  "Failed",
] as const;

export type GatewayMetricPhase = (typeof gatewayMetricPhases)[number];

interface PrometheusQueryResponse {
  status: string;
  data?: {
    result: {
      metric: { phase?: string };
      value: [string, string];
    }[];
  };
}

export function emptyGatewayPhaseCounts(): Record<GatewayMetricPhase, number> {
  return {
    Running: 0,
    Provisioning: 0,
    Degraded: 0,
    Failed: 0,
  };
}

function isGatewayMetricPhase(value: string): value is GatewayMetricPhase {
  return (gatewayMetricPhases as readonly string[]).includes(value);
}

export async function queryGatewayPhaseCounts(
  prometheusUrl: string,
  timeoutMs: number,
): Promise<Record<GatewayMetricPhase, number>> {
  const queryUrl = new URL("/api/v1/query", prometheusUrl);
  queryUrl.searchParams.set("query", "hypershell_gateways_total");

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

    const counts = emptyGatewayPhaseCounts();
    for (const sample of body.data?.result ?? []) {
      const phase = sample.metric.phase;
      if (phase === undefined || !isGatewayMetricPhase(phase)) {
        continue;
      }
      counts[phase] = Math.round(Number(sample.value[1]));
    }
    return counts;
  } finally {
    clearTimeout(timeout);
  }
}
