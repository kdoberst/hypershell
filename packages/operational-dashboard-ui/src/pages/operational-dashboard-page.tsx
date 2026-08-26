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
import { FormattedMessage, useIntl, type IntlShape } from "react-intl";

import type { OperationalDashboardMetrics } from "../application/dashboard-types";
import type { DashboardProbe } from "../application/dashboard-probes";
import { noopDashboardProbePublisher } from "../application/dashboard-probes";
import {
  defaultDashboardLayoutTemplate,
  GATEWAY_STATUS_WIDGET_HEIGHT,
  localizeDashboardLayoutTemplate,
  SYSTEM_SUMMARY_WIDGET_HEIGHT,
  USAGE_SUMMARY_WIDGET_HEIGHT,
} from "../dashboard/dashboard-layout-template";
import { UtilizationChart } from "../dashboard/utilization-chart";
import { useDashboardUi } from "../dashboard-ui-provider";
import { messages } from "../messages";
import { ResourceRefreshButton } from "../shared/resource-refresh-button";
import "./dashboard-widget.css";
import {
  GatewayStatusCard,
  MetricCard,
  SystemSummaryCard,
  UsageSummaryCard,
} from "./dashboard-widget";
import { useGetMetricsData } from "./get-metrics-data";

const OPERATIONAL_DASHBOARD_BODY_CLASS = "hypershell-operational-dashboard";

const baseTemplate = defaultDashboardLayoutTemplate;

const LAYOUT_STORAGE_KEY = "hypershell.operational-dashboard.layout.v12";
const CUSTOM_COLUMNS: Record<Variants, number> = {
  xl: 4,
  lg: 4,
  md: 4,
  sm: 1,
};

function preservesRequiredWidgets(
  nextTemplate: ExtendedTemplateConfig,
): boolean {
  for (const variant of Object.keys(baseTemplate) as Variants[]) {
    if (!Array.isArray(nextTemplate[variant])) {
      return false;
    }

    const requiredIds = new Set(baseTemplate[variant].map((item) => item.i));

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
  return (Object.keys(baseTemplate) as Variants[]).reduce((acc, variant) => {
    const savedById = new Map(
      savedTemplate[variant].map((item) => [item.i, item]),
    );

    acc[variant] = baseTemplate[variant].map(
      (defaultItem) => savedById.get(defaultItem.i) ?? defaultItem,
    );

    return acc;
  }, {} as ExtendedTemplateConfig);
}

function layoutProbe(
  correlationId: string,
  name: DashboardProbe["name"],
  outcome: DashboardProbe["fields"]["outcome"],
): DashboardProbe {
  return Object.freeze({
    context: Object.freeze({ correlationId }),
    fields: Object.freeze({
      action: "persist-layout-template",
      outcome,
    }),
    name,
    occurredAt: new Date().toISOString(),
    schemaVersion: 1,
  });
}

const METRIC_WIDGET_DEFAULTS = { h: 3, maxH: 5, minH: 2, w: 1 };

function createWidgetMapping(
  metrics: OperationalDashboardMetrics,
  intl: IntlShape,
): WidgetMapping {
  const metricById = new Map(
    metrics.metrics.map((metric) => [metric.id, metric]),
  );

  const renderMetric = (
    metricId: string,
    subtitle: string,
    titleMessage: (typeof messages)[keyof typeof messages],
    metricType: "metric" | "status" | "utilization",
  ) => {
    const metric = metricById.get(metricId);
    const title = intl.formatMessage(titleMessage);

    if (!metric) {
      return (
        <Bullseye>
          <EmptyState headingLevel="h3" variant={EmptyStateVariant.sm}>
            <Title headingLevel="h3">
              <FormattedMessage {...messages.metricUnavailableTitle} />
            </Title>
            <EmptyStateBody>
              <FormattedMessage {...messages.metricUnavailableBody} />
            </EmptyStateBody>
          </EmptyState>
        </Bullseye>
      );
    }

    if (metricType === "metric") {
      return <MetricCard metric={metric} subtitle={subtitle} title={title} />;
    }

    if (metricType === "status") {
      return <GatewayStatusCard metric={metric} />;
    }

    return <UtilizationChart metric={metric} />;
  };

  return {
    "usage-summary": {
      defaults: {
        h: USAGE_SUMMARY_WIDGET_HEIGHT,
        maxH: USAGE_SUMMARY_WIDGET_HEIGHT + 2,
        minH: METRIC_WIDGET_DEFAULTS.minH,
        w: 1,
      },
      config: {
        icon: <UsersIcon />,
        title: intl.formatMessage(messages.usageSummaryWidget),
      },
      renderWidget: () => <UsageSummaryCard metrics={metrics.metrics} />,
    },
    "system-summary": {
      defaults: {
        h: SYSTEM_SUMMARY_WIDGET_HEIGHT,
        maxH: SYSTEM_SUMMARY_WIDGET_HEIGHT + 2,
        minH: METRIC_WIDGET_DEFAULTS.minH,
        w: 1,
      },
      config: {
        icon: <MemoryIcon />,
        title: intl.formatMessage(messages.systemSummaryWidget),
      },
      renderWidget: () => <SystemSummaryCard metrics={metrics.metrics} />,
    },
    "active-users": {
      defaults: METRIC_WIDGET_DEFAULTS,
      config: {
        icon: <UsersIcon />,
        title: intl.formatMessage(messages.activeUsers),
      },
      renderWidget: () =>
        renderMetric("active-users", "", messages.activeUsers, "metric"),
    },
    "gateway-status": {
      defaults: {
        h: GATEWAY_STATUS_WIDGET_HEIGHT,
        maxH: GATEWAY_STATUS_WIDGET_HEIGHT + 2,
        minH: METRIC_WIDGET_DEFAULTS.minH,
        w: 1,
      },
      config: {
        icon: <ClusterIcon />,
        title: intl.formatMessage(messages.gatewayStatusWidget),
      },
      renderWidget: () =>
        renderMetric(
          "provisioned-gateways",
          "",
          messages.gatewayStatusWidget,
          "status",
        ),
    },
    namespaces: {
      defaults: METRIC_WIDGET_DEFAULTS,
      config: {
        icon: <CubesIcon />,
        title: intl.formatMessage(messages.namespaces),
      },
      renderWidget: () =>
        renderMetric("namespaces", "", messages.namespaces, "metric"),
    },
    cpu: {
      defaults: METRIC_WIDGET_DEFAULTS,
      config: {
        icon: <MicrochipIcon />,
        title: intl.formatMessage(messages.widgetCpu),
      },
      renderWidget: () =>
        renderMetric("cpu", "", messages.widgetCpu, "utilization"),
    },
    memory: {
      defaults: METRIC_WIDGET_DEFAULTS,
      config: {
        icon: <MemoryIcon />,
        title: intl.formatMessage(messages.widgetMemory),
      },
      renderWidget: () =>
        renderMetric("memory", "", messages.widgetMemory, "utilization"),
    },
    pods: {
      defaults: METRIC_WIDGET_DEFAULTS,
      config: {
        icon: <CubesIcon />,
        title: intl.formatMessage(messages.widgetPods),
      },
      renderWidget: () =>
        renderMetric("pods", "", messages.widgetPods, "utilization"),
    },
  };
}

export interface OperationalDashboardPageProps {
  metrics?: OperationalDashboardMetrics;
  title?: string;
}

export function OperationalDashboardPage({
  metrics,
  title,
}: Readonly<OperationalDashboardPageProps>) {
  const intl = useIntl();
  const { probes = noopDashboardProbePublisher } = useDashboardUi();
  const pageTitle = title ?? intl.formatMessage(messages.title);
  const metricsQuery = useGetMetricsData({
    enabled: metrics === undefined,
  });
  const dashboardMetrics = metrics ?? metricsQuery.data;
  const localizedBaseTemplate = useMemo(
    () => localizeDashboardLayoutTemplate(baseTemplate, intl),
    [intl],
  );

  useEffect(() => {
    document.body.classList.add(OPERATIONAL_DASHBOARD_BODY_CLASS);

    return () => {
      document.body.classList.remove(OPERATIONAL_DASHBOARD_BODY_CLASS);
    };
  }, []);

  const savedTemplate = useMemo<ExtendedTemplateConfig>(() => {
    if (typeof window === "undefined") {
      return localizedBaseTemplate;
    }

    try {
      const rawTemplate = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (!rawTemplate) {
        return localizedBaseTemplate;
      }

      return localizeDashboardLayoutTemplate(
        restoreRequiredWidgets(
          JSON.parse(rawTemplate) as ExtendedTemplateConfig,
        ),
        intl,
      );
    } catch {
      return localizedBaseTemplate;
    }
  }, [intl, localizedBaseTemplate]);
  const [dashboardTemplate, setDashboardTemplate] =
    useState<ExtendedTemplateConfig>(savedTemplate);
  const [gridLayoutKey, setGridLayoutKey] = useState(0);
  const displayTemplate = useMemo(
    () => localizeDashboardLayoutTemplate(dashboardTemplate, intl),
    [dashboardTemplate, intl],
  );
  const widgetMapping = useMemo(
    () =>
      dashboardMetrics
        ? createWidgetMapping(dashboardMetrics, intl)
        : undefined,
    [dashboardMetrics, intl],
  );

  const handleTemplateChange = (nextTemplate: ExtendedTemplateConfig) => {
    const correlationId = crypto.randomUUID();

    if (!preservesRequiredWidgets(nextTemplate)) {
      probes.publish(
        layoutProbe(
          correlationId,
          "dashboard.layout.template.invalid",
          "failed",
        ),
      );
      setGridLayoutKey((currentKey) => currentKey + 1);
      return;
    }

    setDashboardTemplate(nextTemplate);

    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        LAYOUT_STORAGE_KEY,
        JSON.stringify(nextTemplate),
      );
    } catch {
      probes.publish(
        layoutProbe(
          correlationId,
          "dashboard.layout.template.persistence-failed",
          "failed",
        ),
      );
    }
  };

  return (
    <PageSection isFilled padding={{ default: "padding" }}>
      <Flex
        alignItems={{ default: "alignItemsFlexStart" }}
        justifyContent={{ default: "justifyContentSpaceBetween" }}
      >
        <FlexItem>
          <Content>
            <Title headingLevel="h1">{pageTitle}</Title>
            <p>
              <FormattedMessage {...messages.description} />
            </p>
          </Content>
        </FlexItem>
        {metrics === undefined ? (
          <FlexItem>
            <ResourceRefreshButton
              ariaLabel={intl.formatMessage(messages.refresh)}
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
          <Spinner aria-label={intl.formatMessage(messages.loading)} />
        </Bullseye>
      ) : null}
      {metricsQuery.isError && metrics === undefined ? (
        <Alert
          title={intl.formatMessage(messages.loadErrorTitle)}
          variant="danger"
        >
          {metricsQuery.error instanceof Error
            ? metricsQuery.error.message
            : intl.formatMessage(messages.loadErrorBody)}
        </Alert>
      ) : null}
      {widgetMapping ? (
        <GridLayout
          key={gridLayoutKey}
          columns={CUSTOM_COLUMNS}
          onTemplateChange={handleTemplateChange}
          template={displayTemplate}
          widgetMapping={widgetMapping}
        />
      ) : null}
    </PageSection>
  );
}
