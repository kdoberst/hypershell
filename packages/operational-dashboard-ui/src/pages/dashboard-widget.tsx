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
import type { OperationalMetric } from "../application/dashboard-types";
import { TrendSparklineChart } from "../dashboard/trend-sparkline-chart";
import { UtilizationChart } from "../dashboard/utilization-chart";

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
  return (
    <WidgetContent>
      <Content className="hypershell-dashboard-metric-card">
        <Stack hasGutter>
          <StackItem>
            <Flex justifyContent={{ default: "justifyContentCenter" }}>
              <FlexItem>
                <Title headingLevel="h3" size="lg">
                  {metric.value} {title.toLowerCase()}
                </Title>
                {subtitle ? <small>{subtitle}</small> : null}
              </FlexItem>
            </Flex>
          </StackItem>
          {metric.trend ? (
            <StackItem>
              <TrendSparklineChart
                trend={metric.trend}
                label={title}
                yAxisLabel={title.toLowerCase()}
              />
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
          {metric.trend ? (
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
  return (
    <WidgetContent>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h3" size="md">Usage</Title>
        </StackItem>
        <StackItem>
          <DescriptionList isHorizontal aria-label="Usage metrics"  >
            <DescriptionListGroup>
              <DescriptionListTerm>Users</DescriptionListTerm>
              <DescriptionListDescription>
                {metrics.find((metric) => metric.id === "active-users")?.value}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Gateways</DescriptionListTerm>
              <DescriptionListDescription>
                {metrics.find((metric) => metric.id === "provisioned-gateways")?.value}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Namespaces</DescriptionListTerm>
              <DescriptionListDescription>
                {metrics.find((metric) => metric.id === "namespaces")?.value}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Sandboxes</DescriptionListTerm>
              <DescriptionListDescription>
                {metrics.find((metric) => metric.id === "provisioned-sandboxes")?.value}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </StackItem>
        <hr />
        <StackItem>
          <Title headingLevel="h3" size="md">System</Title>
        </StackItem>
        <StackItem>
          <DescriptionList isHorizontal aria-label="Usage metrics"  >
            <DescriptionListGroup>
              <DescriptionListTerm>Memory</DescriptionListTerm>
              <DescriptionListDescription>
                {metrics.find((metric) => metric.id === "memory")?.value}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>CPUs</DescriptionListTerm>
              <DescriptionListDescription>
                {metrics.find((metric) => metric.id === "cpu")?.value}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Pods</DescriptionListTerm>
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
