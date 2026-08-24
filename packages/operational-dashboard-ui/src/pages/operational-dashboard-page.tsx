import {
  Alert,
  Bullseye,
  Content,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  PageSection,
  Spinner,
  Flex,
  FlexItem,
  Title,
} from "@patternfly/react-core";
import {
  ClusterIcon,
  CubesIcon,
  UsersIcon,
  MicrochipIcon,
  MemoryIcon,
} from "@patternfly/react-icons";
import {
  GridLayout,
  type ExtendedTemplateConfig,
  type Variants,
  type WidgetMapping,
} from "@patternfly/widgetized-dashboard";
import "@patternfly/widgetized-dashboard/dist/esm/styles.css";
import { useEffect, useMemo, useState } from "react";

import type { OperationalDashboardMetrics } from "../application/dashboard-types";
import { defaultDashboardLayoutTemplate, SUMMARY_WIDGET_HEIGHT } from "../dashboard/dashboard-layout-template";
import { UtilizationChart } from "../dashboard/utilization-chart";
import { ResourceRefreshButton } from "../shared/resource-refresh-button";
import "./dashboard-widget.css";
import { MetricCard, SummaryCard } from "./dashboard-widget";
import { useGetMetricsData } from "./get-metrics-data";

const OPERATIONAL_DASHBOARD_BODY_CLASS = "hypershell-operational-dashboard";

const template = defaultDashboardLayoutTemplate;

const LAYOUT_STORAGE_KEY = "hypershell.operational-dashboard.layout.v6";
const REFRESH_DASHBOARD_ARIA_LABEL = "Refresh dashboard metrics";
const CUSTOM_COLUMNS: Record<Variants, number> = {
  xl: 4,
  lg: 4,
  md: 4,
  sm: 1,
};

function preservesRequiredWidgets(
  nextTemplate: ExtendedTemplateConfig,
): boolean {
  for (const variant of Object.keys(template) as Variants[]) {
    const requiredIds = new Set(template[variant].map((item) => item.i));

    for (const id of requiredIds) {
      if (!nextTemplate[variant].some((item) => item.i === id)) {
        return false;
      }
    }
  }

  return true;
}

function restoreRequiredWidgets(
  savedTemplate: ExtendedTemplateConfig,
): ExtendedTemplateConfig {
  return (Object.keys(template) as Variants[]).reduce((acc, variant) => {
    const savedById = new Map(
      savedTemplate[variant].map((item) => [item.i, item]),
    );

    acc[variant] = template[variant].map(
      (defaultItem) => savedById.get(defaultItem.i) ?? defaultItem,
    );

    return acc;
  }, {} as ExtendedTemplateConfig);
}

const METRIC_WIDGET_DEFAULTS = { h: 3, maxH: 5, minH: 2, w: 1 };

function createWidgetMapping(
  metrics: OperationalDashboardMetrics,
): WidgetMapping {
  const metricById = new Map(
    metrics.metrics.map((metric) => [metric.id, metric]),
  );

  const renderMetric = (
    metricId: string,
    subtitle: string,
    title: string,
    metricType: "metric" | "utilization",
  ) => {
    const metric = metricById.get(metricId);
    if (!metric) {
      return (
        <Bullseye>
          <EmptyState headingLevel="h3" variant={EmptyStateVariant.sm}>
            <Title headingLevel="h3">Metric unavailable</Title>
            <EmptyStateBody>
              This information not currently available.
            </EmptyStateBody>
          </EmptyState>
        </Bullseye>
      );
    }

    return metricType === "metric" ? (
      <MetricCard metric={metric} subtitle={subtitle} title={title} />
    ) : (
      <UtilizationChart metric={metric} />
    );
  };

  return {
    summary: {
      defaults: {
        h: SUMMARY_WIDGET_HEIGHT,
        maxH: SUMMARY_WIDGET_HEIGHT + 2,
        minH: METRIC_WIDGET_DEFAULTS.minH,
        w: 1,
      },
      config: { icon: <UsersIcon />, title: "Summary" },
      renderWidget: () => <SummaryCard metrics={metrics.metrics} />,
    },
    "active-users": {
      defaults: METRIC_WIDGET_DEFAULTS,
      config: { icon: <UsersIcon />, title: "Active users" },
      renderWidget: () =>
        renderMetric("active-users", "", "Active users", "metric"),
    },
    "provisioned-gateways": {
      defaults: METRIC_WIDGET_DEFAULTS,
      config: { icon: <ClusterIcon />, title: "Provisioned gateways" },
      renderWidget: () =>
        renderMetric(
          "provisioned-gateways",
          "",
          "Provisioned gateways",
          "metric",
        ),
    },
    "provisioned-sandboxes": {
      defaults: METRIC_WIDGET_DEFAULTS,
      config: { icon: <CubesIcon />, title: "Provisioned sandboxes" },
      renderWidget: () =>
        renderMetric(
          "provisioned-sandboxes",
          "",
          "Provisioned sandboxes",
          "metric",
        ),
    },
    namespaces: {
      defaults: METRIC_WIDGET_DEFAULTS,
      config: { icon: <CubesIcon />, title: "Namespaces" },
      renderWidget: () =>
        renderMetric("namespaces", "", "Namespaces", "metric"),
    },
    nodes: {
      defaults: METRIC_WIDGET_DEFAULTS,
      config: { icon: <ClusterIcon />, title: "Nodes" },
      renderWidget: () => renderMetric("nodes", "", "Nodes", "metric"),
    },
    cpu: {
      defaults: METRIC_WIDGET_DEFAULTS,
      config: { icon: <MicrochipIcon />, title: "CPU" },
      renderWidget: () => renderMetric("cpu", "", "CPU", "utilization"),
    },
    memory: {
      defaults: METRIC_WIDGET_DEFAULTS,
      config: { icon: <MemoryIcon />, title: "Memory" },
      renderWidget: () => renderMetric("memory", "", "Memory", "utilization"),
    },
    pods: {
      defaults: METRIC_WIDGET_DEFAULTS,
      config: { icon: <CubesIcon />, title: "Pods" },
      renderWidget: () => renderMetric("pods", "", "Pods", "utilization"),
    },
  };
}

export interface OperationalDashboardPageProps {
  metrics?: OperationalDashboardMetrics;
  title?: string;
}

export function OperationalDashboardPage({
  metrics,
  title = "HyperShell operational dashboard",
}: Readonly<OperationalDashboardPageProps>) {
  const metricsQuery = useGetMetricsData({
    enabled: metrics === undefined,
  });
  const dashboardMetrics = metrics ?? metricsQuery.data;

  useEffect(() => {
    document.body.classList.add(OPERATIONAL_DASHBOARD_BODY_CLASS);

    return () => {
      document.body.classList.remove(OPERATIONAL_DASHBOARD_BODY_CLASS);
    };
  }, []);

  const savedTemplate = useMemo<ExtendedTemplateConfig>(() => {
    if (typeof window === "undefined") {
      return template;
    }

    try {
      const rawTemplate = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (!rawTemplate) {
        return template;
      }

      return restoreRequiredWidgets(
        JSON.parse(rawTemplate) as ExtendedTemplateConfig,
      );
    } catch {
      return template;
    }
  }, []);
  const [dashboardTemplate, setDashboardTemplate] =
    useState<ExtendedTemplateConfig>(savedTemplate);
  const [gridLayoutKey, setGridLayoutKey] = useState(0);
  const widgetMapping = useMemo(
    () =>
      dashboardMetrics ? createWidgetMapping(dashboardMetrics) : undefined,
    [dashboardMetrics],
  );

  const handleTemplateChange = (nextTemplate: ExtendedTemplateConfig) => {
    if (!preservesRequiredWidgets(nextTemplate)) {
      setGridLayoutKey((currentKey) => currentKey + 1);
      return;
    }

    setDashboardTemplate(nextTemplate);

    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      LAYOUT_STORAGE_KEY,
      JSON.stringify(nextTemplate),
    );
  };

  return (
    <PageSection isFilled padding={{ default: "padding" }}>
      <Flex
        alignItems={{ default: "alignItemsFlexStart" }}
        justifyContent={{ default: "justifyContentSpaceBetween" }}
      >
        <FlexItem>
          <Content>
            <Title headingLevel="h1">{title}</Title>
            <p>
              Early dashboard aligned to HYPERSHELL-112 with mocked values for
              signup, active user, and provisioned resource metrics.
            </p>
          </Content>
        </FlexItem>
        {metrics === undefined ? (
          <FlexItem>
            <ResourceRefreshButton
              ariaLabel={REFRESH_DASHBOARD_ARIA_LABEL}
              isRefreshing={metricsQuery.isFetching}
              onRefresh={() => {
                void metricsQuery.refetch();
              }}
            />
          </FlexItem>
        ) : null}
      </Flex>
      {metricsQuery.isPending && metrics === undefined ? (
        <Bullseye>
          <Spinner aria-label="Loading operational dashboard metrics" />
        </Bullseye>
      ) : null}
      {metricsQuery.isError && metrics === undefined ? (
        <Alert
          title="Operational dashboard metrics are unavailable"
          variant="danger"
        >
          {metricsQuery.error instanceof Error
            ? metricsQuery.error.message
            : "An unexpected error occurred while loading dashboard metrics."}
        </Alert>
      ) : null}
      {widgetMapping ? (
        <GridLayout
          key={gridLayoutKey}
          columns={CUSTOM_COLUMNS}
          onTemplateChange={handleTemplateChange}
          template={dashboardTemplate}
          widgetMapping={widgetMapping}
        />
      ) : null}
    </PageSection>
  );
}
