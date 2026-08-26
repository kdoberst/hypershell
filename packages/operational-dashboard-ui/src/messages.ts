import { defineMessages } from "react-intl";

export const messages = defineMessages({
  activeUsers: {
    id: "app.dashboard.widget.activeUsers",
    defaultMessage: "Active users",
    description: "Title for the active users dashboard widget.",
  },
  cpus: {
    id: "app.dashboard.summary.cpus",
    defaultMessage: "CPUs",
    description: "Summary label for provisioned CPU capacity.",
  },
  description: {
    id: "app.dashboard.description",
    defaultMessage:
      "This dashboard is in development and is currently using mocked data.",
    description: "Supporting text on the operational dashboard page.",
  },
  gateways: {
    id: "app.dashboard.summary.gateways",
    defaultMessage: "Gateways",
    description: "Summary label for provisioned gateways.",
  },
  gatewayStatusAriaDesc: {
    id: "app.dashboard.gatewayStatus.ariaDesc",
    defaultMessage: "Gateway count by status",
    description: "Accessible description for the gateway status donut chart.",
  },
  gatewayStatusChartTitle: {
    id: "app.dashboard.gatewayStatus.chartTitle",
    defaultMessage: "Gateway status chart",
    description: "Accessible title for the gateway status donut chart.",
  },
  gatewayStatusDataLabel: {
    id: "app.dashboard.gatewayStatus.dataLabel",
    defaultMessage: "{status}: {count}",
    description: "Data label for a gateway status donut chart segment.",
  },
  gatewayStatusDegraded: {
    id: "app.dashboard.gatewayStatus.degraded",
    defaultMessage: "Degraded",
    description: "Legend label for degraded gateways.",
  },
  gatewayStatusFailed: {
    id: "app.dashboard.gatewayStatus.failed",
    defaultMessage: "Failed",
    description: "Legend label for failed gateways.",
  },
  gatewayStatusLegend: {
    id: "app.dashboard.gatewayStatus.legend",
    defaultMessage: "{status}: {count}",
    description: "Legend entry for a gateway status donut chart segment.",
  },
  gatewayStatusProvisioning: {
    id: "app.dashboard.gatewayStatus.provisioning",
    defaultMessage: "Provisioning",
    description: "Legend label for provisioning gateways.",
  },
  gatewayStatusRunning: {
    id: "app.dashboard.gatewayStatus.running",
    defaultMessage: "Running",
    description: "Legend label for running gateways.",
  },
  gatewayStatusWidget: {
    id: "app.dashboard.widget.gatewayStatus",
    defaultMessage: "Gateway status",
    description: "Title for the gateway status dashboard widget.",
  },
  loadErrorBody: {
    id: "app.dashboard.loadError.body",
    defaultMessage:
      "An unexpected error occurred while loading dashboard metrics.",
    description:
      "Recovery guidance when operational dashboard metrics cannot be loaded.",
  },
  loadErrorTitle: {
    id: "app.dashboard.loadError.title",
    defaultMessage: "Operational dashboard metrics are unavailable",
    description:
      "Title shown when operational dashboard metrics cannot be loaded.",
  },
  loading: {
    id: "app.dashboard.loading",
    defaultMessage: "Loading operational dashboard metrics",
    description:
      "Accessible status shown while operational dashboard metrics load.",
  },
  memory: {
    id: "app.dashboard.summary.memory",
    defaultMessage: "Memory",
    description: "Summary label for memory utilization.",
  },
  metricUnavailableBody: {
    id: "app.dashboard.metricUnavailable.body",
    defaultMessage: "This information is not currently available.",
    description:
      "Recovery guidance when an individual dashboard metric is missing.",
  },
  metricUnavailableTitle: {
    id: "app.dashboard.metricUnavailable.title",
    defaultMessage: "Metric unavailable",
    description:
      "Heading shown when an individual dashboard metric is missing.",
  },
  metricValue: {
    id: "app.dashboard.metric.value",
    defaultMessage: "{value} {label}",
    description: "Formatted count for a dashboard metric card heading.",
  },
  namespaces: {
    id: "app.dashboard.widget.namespaces",
    defaultMessage: "Namespaces",
    description: "Title for the namespaces dashboard widget.",
  },
  nodes: {
    id: "app.dashboard.widget.nodes",
    defaultMessage: "Nodes",
    description: "Title for the nodes dashboard widget.",
  },
  pods: {
    id: "app.dashboard.summary.pods",
    defaultMessage: "Pods",
    description: "Summary label for pod utilization.",
  },
  provisionedGateways: {
    id: "app.dashboard.widget.provisionedGateways",
    defaultMessage: "Provisioned gateways",
    description: "Title for the provisioned gateways dashboard widget.",
  },
  provisionedSandboxes: {
    id: "app.dashboard.widget.provisionedSandboxes",
    defaultMessage: "Provisioned sandboxes",
    description: "Title for the provisioned sandboxes dashboard widget.",
  },
  refresh: {
    id: "app.dashboard.refresh",
    defaultMessage: "Refresh dashboard metrics",
    description:
      "Accessible label for refreshing operational dashboard metrics.",
  },
  summary: {
    id: "app.dashboard.widget.summary",
    defaultMessage: "Summary",
    description: "Title for the operational dashboard summary widget.",
  },
  summarySystem: {
    id: "app.dashboard.summary.system",
    defaultMessage: "System",
    description:
      "Heading for system utilization metrics in the summary widget.",
  },
  summarySystemAriaLabel: {
    id: "app.dashboard.summary.systemAriaLabel",
    defaultMessage: "System metrics",
    description:
      "Accessible label for the system metrics list in the summary widget.",
  },
  summaryUsage: {
    id: "app.dashboard.summary.usage",
    defaultMessage: "Usage",
    description: "Heading for adoption metrics in the summary widget.",
  },
  summaryUsageAriaLabel: {
    id: "app.dashboard.summary.usageAriaLabel",
    defaultMessage: "Usage metrics",
    description:
      "Accessible label for the usage metrics list in the summary widget.",
  },
  systemSummaryWidget: {
    id: "app.dashboard.widget.systemSummary",
    defaultMessage: "System summary",
    description: "Title for the operational dashboard system summary widget.",
  },
  title: {
    id: "app.dashboard.title",
    defaultMessage: "HyperShell operational dashboard",
    description: "Main heading on the operational dashboard page.",
  },
  trendLastDays: {
    id: "app.dashboard.trend.lastDays",
    defaultMessage: "Last {days} days",
    description: "Caption below a trend sparkline showing the lookback window.",
  },
  trendTooltip: {
    id: "app.dashboard.trend.tooltip",
    defaultMessage: "{date}: {value} {metric}",
    description: "Tooltip for a dashboard metric trend sparkline point.",
  },
  usageSummaryWidget: {
    id: "app.dashboard.widget.usageSummary",
    defaultMessage: "Usage summary",
    description: "Title for the operational dashboard usage summary widget.",
  },
  users: {
    id: "app.dashboard.summary.users",
    defaultMessage: "Users",
    description: "Summary label for active users.",
  },
  utilizationCapacity: {
    id: "app.dashboard.utilization.capacity",
    defaultMessage: "{unit} capacity",
    description: "Capacity label for a utilization donut chart.",
  },
  utilizationChartTitle: {
    id: "app.dashboard.utilization.chartTitle",
    defaultMessage: "{unit} utilization chart",
    description: "Accessible title for a utilization donut chart.",
  },
  utilizationDataLabel: {
    id: "app.dashboard.utilization.dataLabel",
    defaultMessage: "{capacity}: {percentage}%",
    description: "Data label for a utilization donut chart segment.",
  },
  utilizationLabel: {
    id: "app.dashboard.utilization.label",
    defaultMessage: "{value} {unit}",
    description: "Primary value label for a utilization donut chart.",
  },
  utilizationSubtitle: {
    id: "app.dashboard.utilization.subtitle",
    defaultMessage: "of {total} {unit}",
    description: "Subtitle for a utilization donut chart.",
  },
  widgetCpu: {
    id: "app.dashboard.widget.cpu",
    defaultMessage: "CPU",
    description: "Title for the CPU utilization dashboard widget.",
  },
  widgetMemory: {
    id: "app.dashboard.widget.memory",
    defaultMessage: "Memory",
    description: "Title for the memory utilization dashboard widget.",
  },
  widgetPods: {
    id: "app.dashboard.widget.pods",
    defaultMessage: "Pods",
    description: "Title for the pods utilization dashboard widget.",
  },
  widgetSandboxes: {
    id: "app.dashboard.summary.sandboxes",
    defaultMessage: "Sandboxes",
    description: "Summary label for provisioned sandboxes.",
  },
});
