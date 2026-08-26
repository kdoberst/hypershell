import {
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
} from "@patternfly/react-core";
import type { PropsWithChildren } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import type { OperationalMetric } from "../application/dashboard-types";
import { TrendSparklineChart } from "../dashboard/trend-sparkline-chart";
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
  subtitle,
  title,
}: Readonly<{ metric: OperationalMetric; subtitle: string; title: string }>) {
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
          {metric.trend ? (
            <StackItem>
              <TrendSparklineChart trend={metric.trend} title={title} />
            </StackItem>
          ) : null}
        </Stack>
      </Content>
    </WidgetContent>
  );
}

export function UtilizationCard({
  metric,
  subtitle,
}: Readonly<{ metric: OperationalMetric; subtitle: string; title: string }>) {
  return (
    <WidgetContent>
      <Content>
        <Stack hasGutter>
          <StackItem>
            <Flex justifyContent={{ default: "justifyContentCenter" }}>
              <FlexItem>
                <h2>
                  {metric.value} {metric.unit}
                </h2>
                <small>{subtitle}</small>
              </FlexItem>
            </Flex>
          </StackItem>
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

export function SummaryCard({
  metrics,
}: Readonly<{ metrics: readonly OperationalMetric[] }>) {
  const intl = useIntl();

  return (
    <WidgetContent>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h3" size="md">
            <FormattedMessage {...messages.summaryUsage} />
          </Title>
        </StackItem>
        <StackItem>
          <DescriptionList
            isHorizontal
            aria-label={intl.formatMessage(messages.summaryUsageAriaLabel)}
          >
            <DescriptionListGroup>
              <DescriptionListTerm>
                <FormattedMessage {...messages.users} />
              </DescriptionListTerm>
              <DescriptionListDescription>
                {metrics.find((metric) => metric.id === "active-users")?.value}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>
                <FormattedMessage {...messages.gateways} />
              </DescriptionListTerm>
              <DescriptionListDescription>
                {
                  metrics.find((metric) => metric.id === "provisioned-gateways")
                    ?.value
                }
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>
                <FormattedMessage {...messages.namespaces} />
              </DescriptionListTerm>
              <DescriptionListDescription>
                {metrics.find((metric) => metric.id === "namespaces")?.value}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>
                <FormattedMessage {...messages.widgetSandboxes} />
              </DescriptionListTerm>
              <DescriptionListDescription>
                {
                  metrics.find(
                    (metric) => metric.id === "provisioned-sandboxes",
                  )?.value
                }
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </StackItem>
        <hr />
        <StackItem>
          <Title headingLevel="h3" size="md">
            <FormattedMessage {...messages.summarySystem} />
          </Title>
        </StackItem>
        <StackItem>
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
        </StackItem>
      </Stack>
    </WidgetContent>
  );
}
