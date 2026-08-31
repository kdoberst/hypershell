import type { IntlShape } from "react-intl";

import type { OperationalMetricStatus } from "../application/dashboard-types";
import { messages } from "../messages";

/**
 * Gateway status colors aligned with PatternFly Alert and Label status semantics.
 */
export const GATEWAY_STATUS_COLORS = {
  degraded: "#ffcc17",
  failed: "#b1380b",
  healthy: "#63993d",
  provisioning: "#0066cc",
} as const;

export const GATEWAY_STATUS_ORDER = [
  "healthy",
  "provisioning",
  "degraded",
  "failed",
] as const satisfies readonly (keyof OperationalMetricStatus)[];

type GatewayStatusKey = (typeof GATEWAY_STATUS_ORDER)[number];

export interface GatewayStatusDatum {
  x: string;
  y: number;
}

export interface GatewayStatusLegendDatum {
  name: string;
}

function gatewayStatusLabel(intl: IntlShape, status: GatewayStatusKey): string {
  switch (status) {
    case "healthy":
      return intl.formatMessage(messages.gatewayStatusHealthy);
    case "provisioning":
      return intl.formatMessage(messages.gatewayStatusProvisioning);
    case "degraded":
      return intl.formatMessage(messages.gatewayStatusDegraded);
    case "failed":
      return intl.formatMessage(messages.gatewayStatusFailed);
  }
}

export function buildGatewayStatusData(
  intl: IntlShape,
  status: OperationalMetricStatus,
): {
  colorScale: string[];
  data: GatewayStatusDatum[];
  legendData: GatewayStatusLegendDatum[];
} {
  const entries = GATEWAY_STATUS_ORDER.flatMap((key) => {
    const count = status[key];
    if (count === undefined || count <= 0) {
      return [];
    }

    const label = gatewayStatusLabel(intl, key);

    return [
      {
        color: GATEWAY_STATUS_COLORS[key],
        datum: { x: label, y: count },
        legend: {
          name: intl.formatMessage(messages.gatewayStatusLegend, {
            count,
            status: label,
          }),
        },
      },
    ];
  });

  return {
    colorScale: entries.map((entry) => entry.color),
    data: entries.map((entry) => entry.datum),
    legendData: entries.map((entry) => entry.legend),
  };
}
