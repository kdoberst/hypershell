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
  Stack,
  StackItem,
  Title,
  Tooltip,
} from "@patternfly/react-core";
import { TrendDownIcon, TrendUpIcon } from "@patternfly/react-icons";
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
  const trendDayCount = metric.trend?.points.length ?? 0;

  return (
    <WidgetContent>
      <Content className="hypershell-dashboard-gateway-status-card">
        <Stack hasGutter>
          <StackItem>
            <GatewayStatusChart metric={metric} />
          </StackItem>
          {metric.trend ? (
            <>
              <StackItem>
                <TrendSparklineChart trend={metric.trend} title={trendTitle} />
              </StackItem>
              {trendDayCount > 0 ? (
                <StackItem>
                  <small>
                    <FormattedMessage
                      {...messages.trendLastDays}
                      values={{ days: trendDayCount }}
                    />
                  </small>
                </StackItem>
              ) : null}
            </>
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
            {metrics.find((metric) => metric.id === "memory")?.value}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            <FormattedMessage {...messages.cpus} />
          </DescriptionListTerm>
          <DescriptionListDescription>
            {metrics.find((metric) => metric.id === "cpu")?.value}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            <FormattedMessage {...messages.pods} />
          </DescriptionListTerm>
          <DescriptionListDescription>
            {metrics.find((metric) => metric.id === "pods")?.value}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </WidgetContent>
  );
}
