import { ChartDonut } from "@patternfly/react-charts/victory";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIntl, type IntlShape } from "react-intl";

import type {
  OperationalMetric,
  OperationalMetricStatus,
} from "../application/dashboard-types";
import { messages } from "../messages";
import "../pages/dashboard-widget.css";

/**
 * Gateway status colors aligned with PatternFly Alert and Label status semantics.
 * Solid donut segments use the vivid fills/icons from those components; alert
 * success green (#3d7317) is intended for icons on tinted backgrounds and reads
 * too dark as a large chart slice, so healthy uses chart green-100 instead.
 *
 * @see https://www.patternfly.org/components/alert
 * @see https://www.patternfly.org/components/label
 */
const GATEWAY_STATUS_COLORS = {
  degraded: "#ffcc17", // Label status warning background
  failed: "#b1380b", // Alert/Label status danger
  healthy: "#63993d", // Chart green-100 (success)
  provisioning: "#0066cc", // Chart blue-100 (in-progress)
} as const;

const GATEWAY_STATUS_ORDER = [
  "healthy",
  "provisioning",
  "degraded",
  "failed",
] as const satisfies readonly (keyof OperationalMetricStatus)[];

type GatewayStatusKey = (typeof GATEWAY_STATUS_ORDER)[number];

interface GatewayStatusDatum {
  x: string;
  y: number;
}

interface GatewayStatusLegendDatum {
  name: string;
}

interface GatewayStatusMetric {
  id: string;
  status: OperationalMetricStatus;
  value: string;
}

/** Rendered pixel size; must match the donut wrapper and ChartDonut height. */
const GATEWAY_STATUS_CHART_HEIGHT = 165;

/** Extra right padding keeps the legend inside the clipped widget body. */
const GATEWAY_STATUS_CHART_PADDING = {
  bottom: 25,
  left: 20,
  right: 145,
  top: 20,
} as const;

export function isGatewayStatusMetric(
  metric: OperationalMetric,
): metric is GatewayStatusMetric {
  return metric.status !== undefined;
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

function buildGatewayStatusData(
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

export function GatewayStatusChart({
  metric,
}: Readonly<{ metric: OperationalMetric }>) {
  const intl = useIntl();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(275);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width;
      if (nextWidth && nextWidth > 0) {
        setWidth(nextWidth);
      }
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const { colorScale, data, legendData } = useMemo(() => {
    if (!isGatewayStatusMetric(metric)) {
      return { colorScale: [], data: [], legendData: [] };
    }

    return buildGatewayStatusData(intl, metric.status);
  }, [intl, metric]);

  if (!isGatewayStatusMetric(metric) || data.length === 0) {
    return null;
  }

  const subTitle = intl.formatMessage(messages.gateways);

  return (
    <div
      ref={containerRef}
      className="hypershell-dashboard-gateway-status-chart"
      style={{ height: GATEWAY_STATUS_CHART_HEIGHT, width: "100%" }}
    >
      <ChartDonut
        ariaDesc={intl.formatMessage(messages.gatewayStatusAriaDesc)}
        ariaTitle={intl.formatMessage(messages.gatewayStatusChartTitle)}
        colorScale={colorScale}
        constrainToVisibleArea
        data={data}
        height={GATEWAY_STATUS_CHART_HEIGHT}
        labels={({ datum }: { datum: GatewayStatusDatum }) =>
          datum.x
            ? intl.formatMessage(messages.gatewayStatusDataLabel, {
                count: datum.y,
                status: datum.x,
              })
            : null
        }
        legendData={legendData}
        legendOrientation="vertical"
        legendPosition="right"
        padding={GATEWAY_STATUS_CHART_PADDING}
        subTitle={subTitle}
        subTitlePosition="bottom"
        title={metric.value}
        width={width}
      />
    </div>
  );
}
