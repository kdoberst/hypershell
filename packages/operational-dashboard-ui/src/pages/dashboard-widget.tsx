import {
  Button,
  Card,
  CardBody,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Icon,
  Stack,
  StackItem,
  Title,
  Tooltip,
} from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  TrendDownIcon,
  TrendUpIcon,
} from "@patternfly/react-icons";
import type { PropsWithChildren } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import type { OperationalMetric } from "../application/dashboard-types";
import {
  getMetricTrendChange,
  type MetricTrendChange,
} from "../dashboard/metric-trend-change";
import { TrendSparklineChart } from "../dashboard/trend-sparkline-chart";
import { GatewayStatusChart } from "../dashboard/gateway-status-chart";
import {
  getUtilizationPercentage,
  getUtilizationStatusLevel,
  isUtilizationMetric,
  UtilizationChart,
} from "../dashboard/utilization-chart";
import { messages } from "../messages";

function WidgetContent({ children }: Readonly<PropsWithChildren>) {
  return (
    <Card isPlain isFullHeight>
      <CardBody>{children}</CardBody>
    </Card>
  );
}

export function MetricCard({
  metric,
  showTrend = true,
  subtitle,
  title,
}: Readonly<{
  metric: OperationalMetric;
  showTrend?: boolean;
  subtitle: string;
  title: string;
}>) {
  const intl = useIntl();

  return (
    <WidgetContent>
      <Content className="hypershell-dashboard-metric-card">
        <Stack hasGutter>
          <StackItem>
            <Flex justifyContent={{ default: "justifyContentCenter" }}>
              <FlexItem>
                <Title headingLevel="h3" size="lg">
                  {intl.formatMessage(messages.metricValue, {
                    label: title,
                    value: metric.value,
                  })}
                </Title>
                {subtitle ? <small>{subtitle}</small> : null}
              </FlexItem>
            </Flex>
          </StackItem>
          {showTrend && metric.trend ? (
            <StackItem>
              <TrendSparklineChart trend={metric.trend} title={title} />
            </StackItem>
          ) : null}
        </Stack>
      </Content>
    </WidgetContent>
  );
}

export function GatewayStatusCard({
  metric,
}: Readonly<{ metric: OperationalMetric }>) {
  const intl = useIntl();
  const trendTitle = intl.formatMessage(messages.provisionedGateways);

  return (
    <WidgetContent>
      <Content className="hypershell-dashboard-gateway-status-card">
        <Stack hasGutter>
          <StackItem>
            <GatewayStatusChart metric={metric} />
          </StackItem>
          {metric.trend ? (
            <StackItem>
              <TrendSparklineChart trend={metric.trend} title={trendTitle} />
            </StackItem>
          ) : null}
        </Stack>
      </Content>
    </WidgetContent>
  );
}

export function UtilizationCard({
  metric,
}: Readonly<{ metric: OperationalMetric }>) {
  return (
    <WidgetContent>
      <Content>
        <Stack hasGutter>
          {isUtilizationMetric(metric) ? (
            <StackItem>
              <UtilizationChart metric={metric} />
            </StackItem>
          ) : null}
        </Stack>
      </Content>
    </WidgetContent>
  );
}

function SummaryTrendIndicator({
  trendChange,
}: Readonly<{ trendChange: MetricTrendChange }>) {
  const intl = useIntl();
  const isIncrease = trendChange.direction === "increase";
  const tooltipContent = intl.formatMessage(
    isIncrease ? messages.summaryTrendIncrease : messages.summaryTrendDecrease,
    { percent: trendChange.percent },
  );

  return (
    <Tooltip content={tooltipContent} aria="labelledby">
      <Button
        aria-label={tooltipContent}
        className={
          isIncrease
            ? "hypershell-dashboard-summary-trend hypershell-dashboard-summary-trend--increase"
            : "hypershell-dashboard-summary-trend hypershell-dashboard-summary-trend--decrease"
        }
        isInline
        variant="plain"
      >
        {isIncrease ? <TrendUpIcon /> : <TrendDownIcon />}
      </Button>
    </Tooltip>
  );
}

function UtilizationStatusIcon({
  percentage,
  total,
  unit,
  value,
}: Readonly<{
  percentage: number;
  total: string;
  unit: string;
  value: string;
}>) {
  const intl = useIntl();
  const statusLevel = getUtilizationStatusLevel(percentage);
  const tooltipContent = intl.formatMessage(
    messages.utilizationSummaryTooltip,
    {
      percent: percentage,
      separator: "  | ",
      total,
      unit,
      value,
    },
  );

  const statusIcon = (() => {
    switch (statusLevel) {
      case "ok":
        return (
          <Icon isInline status="success">
            <CheckCircleIcon aria-hidden />
          </Icon>
        );
      case "warning":
        return (
          <Icon isInline status="warning">
            <ExclamationTriangleIcon aria-hidden />
          </Icon>
        );
      case "danger":
        return (
          <Icon isInline status="danger">
            <ExclamationCircleIcon aria-hidden />
          </Icon>
        );
    }
  })();

  return (
    <Tooltip content={tooltipContent} aria="labelledby">
      <Button
        aria-label={tooltipContent}
        className="hypershell-dashboard-summary-utilization-status"
        isInline
        variant="plain"
      >
        {statusIcon}
      </Button>
    </Tooltip>
  );
}

function SummaryUtilizationValue({
  metric,
}: Readonly<{ metric: OperationalMetric | undefined }>) {
  const intl = useIntl();

  if (!metric) {
    return null;
  }

  if (!isUtilizationMetric(metric)) {
    return (
      <>
        {metric.unit
          ? intl.formatMessage(messages.utilizationLabel, {
              unit: metric.unit,
              value: metric.value,
            })
          : metric.value}
      </>
    );
  }

  const percentage = getUtilizationPercentage(metric.value, metric.total);

  return (
    <Flex
      alignItems={{ default: "alignItemsCenter" }}
      spaceItems={{ default: "spaceItemsSm" }}
    >
      <FlexItem>
        {intl.formatMessage(messages.utilizationLabel, {
          unit: metric.unit,
          value: metric.value,
        })}
      </FlexItem>
      <FlexItem>
        <UtilizationStatusIcon
          percentage={percentage}
          total={metric.total}
          unit={metric.unit}
          value={metric.value}
        />
      </FlexItem>
    </Flex>
  );
}

function SummaryMetricValue({
  metric,
}: Readonly<{ metric: OperationalMetric | undefined }>) {
  const trendChange = metric ? getMetricTrendChange(metric) : undefined;

  return (
    <Flex
      alignItems={{ default: "alignItemsCenter" }}
      spaceItems={{ default: "spaceItemsSm" }}
    >
      <FlexItem>{metric?.value}</FlexItem>
      {trendChange ? (
        <FlexItem>
          <SummaryTrendIndicator trendChange={trendChange} />
        </FlexItem>
      ) : null}
    </Flex>
  );
}

const USAGE_SUMMARY_METRIC_IDS = [
  "active-users",
  "provisioned-gateways",
  "namespaces",
  "provisioned-sandboxes",
] as const;

const USAGE_SUMMARY_LABELS = {
  "active-users": messages.users,
  "provisioned-gateways": messages.gateways,
  namespaces: messages.namespaces,
  "provisioned-sandboxes": messages.widgetSandboxes,
} as const;

export function UsageSummaryCard({
  metrics,
}: Readonly<{ metrics: readonly OperationalMetric[] }>) {
  const intl = useIntl();

  return (
    <WidgetContent>
      <DescriptionList
        isHorizontal
        aria-label={intl.formatMessage(messages.summaryUsageAriaLabel)}
      >
        {USAGE_SUMMARY_METRIC_IDS.map((metricId) => (
          <DescriptionListGroup key={metricId}>
            <DescriptionListTerm>
              <FormattedMessage {...USAGE_SUMMARY_LABELS[metricId]} />
            </DescriptionListTerm>
            <DescriptionListDescription>
              <SummaryMetricValue
                metric={metrics.find((metric) => metric.id === metricId)}
              />
            </DescriptionListDescription>
          </DescriptionListGroup>
        ))}
      </DescriptionList>
    </WidgetContent>
  );
}

export function SystemSummaryCard({
  metrics,
}: Readonly<{ metrics: readonly OperationalMetric[] }>) {
  const intl = useIntl();

  return (
    <WidgetContent>
      <DescriptionList
        isHorizontal
        aria-label={intl.formatMessage(messages.summarySystemAriaLabel)}
      >
        <DescriptionListGroup>
          <DescriptionListTerm>
            <FormattedMessage {...messages.memory} />
          </DescriptionListTerm>
          <DescriptionListDescription>
            <SummaryUtilizationValue
              metric={metrics.find((metric) => metric.id === "memory")}
            />
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            <FormattedMessage {...messages.cpus} />
          </DescriptionListTerm>
          <DescriptionListDescription>
            <SummaryUtilizationValue
              metric={metrics.find((metric) => metric.id === "cpu")}
            />
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            <FormattedMessage {...messages.pods} />
          </DescriptionListTerm>
          <DescriptionListDescription>
            <SummaryUtilizationValue
              metric={metrics.find((metric) => metric.id === "pods")}
            />
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            <FormattedMessage {...messages.nodes} />
          </DescriptionListTerm>
          <DescriptionListDescription>
            {metrics.find((metric) => metric.id === "nodes")?.value}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </WidgetContent>
  );
}
