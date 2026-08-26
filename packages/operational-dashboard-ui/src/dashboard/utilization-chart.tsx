import { ChartDonutUtilization } from "@patternfly/react-charts/victory";
import { useIntl } from "react-intl";

import type {
  OperationalMetric,
  OperationalMetricTrend,
} from "../application/dashboard-types";
import { messages } from "../messages";
import "../pages/dashboard-widget.css";

interface UsageData {
  x: string;
  y: number;
}

interface UtilizationMetric {
  id: string;
  total: string;
  trend?: OperationalMetricTrend;
  unit: string;
  value: string;
}

export function isUtilizationMetric(
  metric: OperationalMetric,
): metric is UtilizationMetric {
  return typeof metric.unit === "string" && typeof metric.total === "string";
}

export function UtilizationChart({
  metric,
}: Readonly<{ metric: OperationalMetric }>) {
  const intl = useIntl();

  if (!isUtilizationMetric(metric)) {
    return null;
  }

  const { unit, total, value } = metric;
  const percentage = Math.round((Number(value) / Number(total)) * 100);
  const capacityLabel = intl.formatMessage(messages.utilizationCapacity, {
    unit,
  });

  const data: UsageData = { x: capacityLabel, y: percentage };

  return (
    <div className="hypershell-dashboard-utilization-chart">
      <ChartDonutUtilization
        ariaDesc={capacityLabel}
        ariaTitle={intl.formatMessage(messages.utilizationChartTitle, {
          unit,
        })}
        constrainToVisibleArea
        data={data}
        labels={({ datum }: { datum: UsageData }) =>
          datum.x
            ? intl.formatMessage(messages.utilizationDataLabel, {
                capacity: datum.x,
                percentage: datum.y,
              })
            : null
        }
        name="chart1"
        subTitle={intl.formatMessage(messages.utilizationSubtitle, {
          total,
          unit,
        })}
        title={intl.formatMessage(messages.utilizationLabel, {
          unit,
          value,
        })}
        thresholds={[{ value: 60 }, { value: 90 }]}
      />
    </div>
  );
}
