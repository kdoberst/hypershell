import type { ExtendedTemplateConfig } from "@patternfly/widgetized-dashboard";
import type { IntlShape } from "react-intl";

import { messages } from "../messages";

const METRIC_WIDGET_HEIGHT = 3;
const METRIC_ROW_GAP = 1;
const METRIC_ROW_STEP = METRIC_WIDGET_HEIGHT + METRIC_ROW_GAP;
const METRIC_ROW_COUNT = 3;
/** Height spanning all metric rows in adjacent columns (3 widgets + 2 gaps). */
export const SUMMARY_WIDGET_HEIGHT =
  METRIC_WIDGET_HEIGHT + (METRIC_ROW_COUNT - 1) * METRIC_ROW_STEP;

const WIDGET_TITLE_MESSAGES = {
  summary: messages.summary,
  "active-users": messages.activeUsers,
  "provisioned-gateways": messages.provisionedGateways,
  memory: messages.widgetMemory,
  namespaces: messages.namespaces,
  "provisioned-sandboxes": messages.provisionedSandboxes,
  cpu: messages.widgetCpu,
  nodes: messages.nodes,
  pods: messages.widgetPods,
} as const;

type DashboardWidgetType = keyof typeof WIDGET_TITLE_MESSAGES;

const fourColumnLayout = [
  {
    h: SUMMARY_WIDGET_HEIGHT,
    i: "summary#1",
    title: "Summary",
    w: 1,
    widgetType: "summary",
    x: 0,
    y: 0,
  },
  {
    h: METRIC_WIDGET_HEIGHT,
    i: "active-users#1",
    title: "Active users",
    w: 1,
    widgetType: "active-users",
    x: 1,
    y: 0,
  },
  {
    h: METRIC_WIDGET_HEIGHT,
    i: "provisioned-gateways#1",
    title: "Provisioned gateways",
    w: 1,
    widgetType: "provisioned-gateways",
    x: 2,
    y: 0,
  },
  {
    h: METRIC_WIDGET_HEIGHT,
    i: "memory#1",
    title: "Memory",
    w: 1,
    widgetType: "memory",
    x: 3,
    y: 0,
  },
  {
    h: METRIC_WIDGET_HEIGHT,
    i: "namespaces#1",
    title: "Namespaces",
    w: 1,
    widgetType: "namespaces",
    x: 1,
    y: METRIC_ROW_STEP,
  },
  {
    h: METRIC_WIDGET_HEIGHT,
    i: "provisioned-sandboxes#1",
    title: "Provisioned sandboxes",
    w: 1,
    widgetType: "provisioned-sandboxes",
    x: 2,
    y: METRIC_ROW_STEP,
  },
  {
    h: METRIC_WIDGET_HEIGHT,
    i: "cpu#1",
    title: "CPU",
    w: 1,
    widgetType: "cpu",
    x: 3,
    y: METRIC_ROW_STEP,
  },
  {
    h: METRIC_WIDGET_HEIGHT,
    i: "nodes#1",
    title: "Nodes",
    w: 1,
    widgetType: "nodes",
    x: 1,
    y: METRIC_ROW_STEP * 2,
  },
  {
    h: METRIC_WIDGET_HEIGHT,
    i: "pods#1",
    title: "Pods",
    w: 1,
    widgetType: "pods",
    x: 3,
    y: METRIC_ROW_STEP * 2,
  },
] as const;

export const defaultDashboardLayoutTemplate: ExtendedTemplateConfig = {
  xl: [...fourColumnLayout],
  lg: [...fourColumnLayout],
  md: [...fourColumnLayout],
  sm: [
    {
      h: SUMMARY_WIDGET_HEIGHT,
      i: "summary#1",
      title: "Summary",
      w: 1,
      widgetType: "summary",
      x: 0,
      y: 0,
    },
    {
      h: METRIC_WIDGET_HEIGHT,
      i: "active-users#1",
      title: "Active users",
      w: 1,
      widgetType: "active-users",
      x: 0,
      y: SUMMARY_WIDGET_HEIGHT,
    },
    {
      h: METRIC_WIDGET_HEIGHT,
      i: "provisioned-gateways#1",
      title: "Provisioned gateways",
      w: 1,
      widgetType: "provisioned-gateways",
      x: 0,
      y: SUMMARY_WIDGET_HEIGHT + METRIC_ROW_STEP,
    },
    {
      h: METRIC_WIDGET_HEIGHT,
      i: "memory#1",
      title: "Memory",
      w: 1,
      widgetType: "memory",
      x: 0,
      y: SUMMARY_WIDGET_HEIGHT + METRIC_ROW_STEP * 2,
    },
    {
      h: METRIC_WIDGET_HEIGHT,
      i: "namespaces#1",
      title: "Namespaces",
      w: 1,
      widgetType: "namespaces",
      x: 0,
      y: SUMMARY_WIDGET_HEIGHT + METRIC_ROW_STEP * 3,
    },
    {
      h: METRIC_WIDGET_HEIGHT,
      i: "provisioned-sandboxes#1",
      title: "Provisioned sandboxes",
      w: 1,
      widgetType: "provisioned-sandboxes",
      x: 0,
      y: SUMMARY_WIDGET_HEIGHT + METRIC_ROW_STEP * 4,
    },
    {
      h: METRIC_WIDGET_HEIGHT,
      i: "cpu#1",
      title: "CPU",
      w: 1,
      widgetType: "cpu",
      x: 0,
      y: SUMMARY_WIDGET_HEIGHT + METRIC_ROW_STEP * 5,
    },
    {
      h: METRIC_WIDGET_HEIGHT,
      i: "nodes#1",
      title: "Nodes",
      w: 1,
      widgetType: "nodes",
      x: 0,
      y: SUMMARY_WIDGET_HEIGHT + METRIC_ROW_STEP * 6,
    },
    {
      h: METRIC_WIDGET_HEIGHT,
      i: "pods#1",
      title: "Pods",
      w: 1,
      widgetType: "pods",
      x: 0,
      y: SUMMARY_WIDGET_HEIGHT + METRIC_ROW_STEP * 7,
    },
  ],
};

export function localizeDashboardLayoutTemplate(
  template: ExtendedTemplateConfig,
  intl: IntlShape,
): ExtendedTemplateConfig {
  return (Object.keys(template) as (keyof ExtendedTemplateConfig)[]).reduce(
    (localized, variant) => {
      localized[variant] = template[variant].map((item) => {
        const widgetType = item.widgetType as DashboardWidgetType;

        return {
          ...item,
          title: intl.formatMessage(WIDGET_TITLE_MESSAGES[widgetType]),
        };
      });
      return localized;
    },
    {} as ExtendedTemplateConfig,
  );
}
