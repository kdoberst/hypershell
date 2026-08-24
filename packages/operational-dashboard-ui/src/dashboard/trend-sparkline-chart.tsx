import {
  ChartArea,
  ChartGroup,
  ChartThemeColor,
  ChartVoronoiContainer,
} from "../patternfly/victory-charts";
import { useEffect, useRef, useState } from "react";

import type { OperationalMetricTrend } from "../application/dashboard-types";

interface SparklineDatum {
  name: string;
  x: string;
  y: number;
}

export function TrendSparklineChart({
  trend, label, yAxisLabel
}: Readonly<{
  trend: OperationalMetricTrend;
  label: string;
  yAxisLabel: string;
}>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(220);

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

  if (trend.points.length < 2) {
    return null;
  }

  const chartData: SparklineDatum[] = trend.points.map((point) => ({
    name: yAxisLabel,
    x: point.label,
    y: point.value,
  }));

  const formatTooltip = (datum: SparklineDatum) =>
    `${datum.x}: ${String(datum.y)} ${yAxisLabel.toLowerCase()}`;

  return (
    <div ref={containerRef} style={{ height: 52, width: "100%" }}>
      <ChartGroup
        ariaDesc={label}
        ariaTitle={label}
        containerComponent={
          <ChartVoronoiContainer
            constrainToVisibleArea
            labels={({ datum }) => formatTooltip(datum as SparklineDatum)}
          />
        }
        height={52}
        padding={{ bottom: 2, left: 2, right: 2, top: 2 }}
        themeColor={ChartThemeColor.blue}
        width={width}
      >
        <ChartArea data={chartData} />
      </ChartGroup>
    </div>
  );
}
