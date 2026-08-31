import { ChartDonut } from "@patternfly/react-charts/victory";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

import type { OperationalMetric } from "../application/dashboard-types";
import { messages } from "../messages";
import "../pages/dashboard-widget.css";
import {
  buildGatewayStatusData,
  type GatewayStatusDatum,
} from "./gateway-status-data";

/** Rendered pixel size; must match the donut wrapper and ChartDonut height. */
const GATEWAY_STATUS_CHART_HEIGHT = 165;

/** Extra right padding keeps the legend inside the clipped widget body. */
const GATEWAY_STATUS_CHART_PADDING = {
  bottom: 25,
  left: 20,
  right: 145,
  top: 20,
} as const;

interface GatewayStatusMetric {
  id: string;
  status: NonNullable<OperationalMetric["status"]>;
  value: string;
}

export function isGatewayStatusMetric(
  metric: OperationalMetric,
): metric is GatewayStatusMetric {
  return metric.status !== undefined;
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
