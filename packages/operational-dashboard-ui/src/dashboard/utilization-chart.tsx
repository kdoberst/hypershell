import { ChartDonutUtilization } from "@patternfly/react-charts/victory";
import type {
  OperationalMetric,
  OperationalMetricTrend,
} from "../application/dashboard-types";

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

function isUtilizationMetric(
  metric: OperationalMetric,
): metric is UtilizationMetric {
  return typeof metric.unit === "string" && typeof metric.total === "string";
}

export function UtilizationChart({
  metric,
}: Readonly<{ metric: OperationalMetric }>) {
  if (!isUtilizationMetric(metric)) {
    return null;
  }

  const { unit, total, value } = metric;
  const percentage = Math.round((Number(value) / Number(total)) * 100);

  const data: UsageData = { x: `${unit} capacity`, y: percentage };

  return (
    <div
      style={{
        aspectRatio: "1/1",
        height: "100%",
        marginInline: "auto",
 
      }}
    >
      <ChartDonutUtilization
        ariaDesc={`${unit} capacity`}
        ariaTitle={`${unit} utilization chart`}
        constrainToVisibleArea
        data={data}
        labels={({ datum }: { datum: UsageData }) =>
          datum.x ? `${datum.x}: ${datum.y.toString()}%` : null
        }
        name="chart1"
        subTitle={`of ${total} ${unit}`}
        title={`${value} ${unit}`}
        thresholds={[{ value: 60 }, { value: 90 }]}
      />
    </div>
  );
}
