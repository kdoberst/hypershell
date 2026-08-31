import { ChartDonut } from "@patternfly/react-charts/victory";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIntl, type IntlShape } from "react-intl";

import type {
  OperationalMetric,
  OperationalMetricStatus,
} from "../application/dashboard-types";
import { messages } from "../messages";
import "../pages/dashboard-widget.css";

const GATEWAY_STATUS_COLOR_VARS = {
  degraded: "--hypershell-gateway-status-degraded-color",
  failed: "--hypershell-gateway-status-failed-color",
  healthy: "--hypershell-gateway-status-healthy-color",
  provisioning: "--hypershell-gateway-status-provisioning-color",
} as const;

const GATEWAY_STATUS_ORDER = [
  "healthy",
  "provisioning",
  "degraded",
  "failed",
] as const satisfies readonly (keyof OperationalMetricStatus)[];

type GatewayStatusKey = (typeof GATEWAY_STATUS_ORDER)[number];

function readGatewayStatusColors(
  element: HTMLElement | null,
): Record<GatewayStatusKey, string> | undefined {
  if (!element) {
    return undefined;
  }

  const style = getComputedStyle(element);
  const colors = GATEWAY_STATUS_ORDER.reduce<
    Partial<Record<GatewayStatusKey, string>>
  >((acc, key) => {
    const color = style.getPropertyValue(GATEWAY_STATUS_COLOR_VARS[key]).trim();
    if (!color) {
      return acc;
    }
    acc[key] = color;
    return acc;
  }, {});

  return GATEWAY_STATUS_ORDER.every((key) => colors[key] !== undefined)
    ? (colors as Record<GatewayStatusKey, string>)
    : undefined;
}

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
  colors: Record<GatewayStatusKey, string>,
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
        color: colors[key],
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
  const [statusColors, setStatusColors] = useState<
    Record<GatewayStatusKey, string> | undefined
  >();

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
      setStatusColors(readGatewayStatusColors(node));
    });
    observer.observe(node);
    setStatusColors(readGatewayStatusColors(node));

    return () => {
      observer.disconnect();
    };
  }, []);

  const { colorScale, data, legendData } = useMemo(() => {
    if (!isGatewayStatusMetric(metric) || statusColors === undefined) {
      return { colorScale: [], data: [], legendData: [] };
    }

    return buildGatewayStatusData(intl, metric.status, statusColors);
  }, [intl, metric, statusColors]);

  if (!isGatewayStatusMetric(metric)) {
    return null;
  }

  const subTitle = intl.formatMessage(messages.gateways);

  // Always mount the color-variable host so readGatewayStatusColors can resolve
  // tokens on first paint. Returning null before this div existed left
  // statusColors undefined forever when counts were present.
  return (
    <div
      ref={containerRef}
      className="hypershell-dashboard-gateway-status-chart"
      style={{ height: GATEWAY_STATUS_CHART_HEIGHT, width: "100%" }}
    >
      {data.length > 0 ? (
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
      ) : null}
    </div>
  );
}
