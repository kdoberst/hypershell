import {
  Button,
  Card,
  CardBody,
  Content,
  Flex,
  FlexItem,
  MenuToggle,
  PageSection,
  Select,
  SelectOption,
  SelectList,
  Title,
} from "@patternfly/react-core";
import { SyncAltIcon } from "@patternfly/react-icons";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import { useState } from "react";

import { HealthStatus } from "../common/health-status";
import { MockupShell } from "../shell/mockup-template";

type Gateway = {
  activeSandboxes: number;
  clusterType: string;
  consoleUrl: string;
  created: string;
  createdBy: string;
  endpoint: string;
  name: string;
  status: string;
  version: string;
};

const gateways: Gateway[] = [
  {
    activeSandboxes: 3,
    clusterType: "IBM Public",
    consoleUrl: "https://console.dev.example.com",
    created: "Oct 29, 2026, 9:41 AM",
    createdBy: "kim-developer",
    endpoint: "https://gw-openshell-87adafc506ea322b.gw.localhost:443",
    name: "payments-gateway",
    status: "Healthy",
    version: "1.8.0",
  },
  {
    activeSandboxes: 1,
    clusterType: "AWS VPN",
    consoleUrl: "https://console.prod.example.com",
    created: "Oct 28, 2026, 4:12 PM",
    createdBy: "alex-operator",
    endpoint: "https://gw-openshell-4lelb22e872df3c5.gw.localhost:443",
    name: "research-gateway",
    status: "Healthy",
    version: "1.8.0",
  },
  {
    activeSandboxes: 0,
    clusterType: "IBM Public Kata",
    consoleUrl: "https://console.staging.example.com",
    created: "Sep 22, 2026, 11:03 AM",
    createdBy: "casey-platform",
    endpoint: "https://gw-openshell-9f4b40e1c471c047.gw.localhost:443",
    name: "integrations-gateway",
    status: "Attention required",
    version: "1.7.4",
  },
];

function GatewaySelect({
  ariaLabel,
  gateways,
  selectedGateway,
  onSelect,
}: {
  ariaLabel: string;
  gateways: Gateway[];
  selectedGateway: Gateway;
  onSelect: (gateway: Gateway) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Select
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onSelect={(_event, value) => {
        const gateway = gateways.find((item) => item.name === value);
        if (gateway) {
          onSelect(gateway);
        }
        setIsOpen(false);
      }}
      selected={selectedGateway.name}
      toggle={(toggleRef) => (
        <MenuToggle
          aria-label={ariaLabel}
          isExpanded={isOpen}
          isFullWidth
          onClick={() => setIsOpen((open) => !open)}
          ref={toggleRef}
        >
          {selectedGateway.name}
        </MenuToggle>
      )}
    >
      <SelectList>
        {gateways.map((gateway) => (
          <SelectOption
            isSelected={gateway.name === selectedGateway.name}
            key={gateway.name}
            value={gateway.name}
          >
            {gateway.name}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
}

function comparisonRows(left: Gateway, right: Gateway) {
  return [
    {
      field: "Active sandboxes",
      left: left.activeSandboxes,
      right: right.activeSandboxes,
    },
    { field: "Cluster type", left: left.clusterType, right: right.clusterType },
    { field: "Console URL", left: left.consoleUrl, right: right.consoleUrl },
    { field: "Created", left: left.created, right: right.created },
    { field: "Created by", left: left.createdBy, right: right.createdBy },
    { field: "Endpoint", left: left.endpoint, right: right.endpoint },
    { field: "Version", left: left.version, right: right.version },
  ];
}

export function GatewayCompareContent({
  initialLeftGateway = "payments-gateway",
  initialRightGateway = "research-gateway",
}: {
  initialLeftGateway?: string;
  initialRightGateway?: string;
}) {
  const initialLeft =
    gateways.find((gateway) => gateway.name === initialLeftGateway) ??
    gateways[0];
  const initialRight =
    gateways.find((gateway) => gateway.name === initialRightGateway) ??
    gateways[1];
  const [leftGateway, setLeftGateway] = useState(initialLeft);
  const [rightGateway, setRightGateway] = useState(initialRight);
  const rows = comparisonRows(leftGateway, rightGateway);

  return (
    <Card>
      <CardBody>
        <Table aria-label="Gateway comparison" variant="compact">
          <Thead>
            <Tr>
              <Th aria-label="Comparison field" modifier="fitContent" />
              <Th>
                <GatewaySelect
                  ariaLabel="Select the first gateway to compare"
                  gateways={gateways}
                  onSelect={setLeftGateway}
                  selectedGateway={leftGateway}
                />
              </Th>
              <Th>
                <GatewaySelect
                  ariaLabel="Select the second gateway to compare"
                  gateways={gateways}
                  onSelect={setRightGateway}
                  selectedGateway={rightGateway}
                />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td dataLabel="Comparison field">Status</Td>
              <Td dataLabel={leftGateway.name}>
                <HealthStatus
                  appearance={
                    leftGateway.status === "Attention required"
                      ? "warning"
                      : "success"
                  }
                  label={leftGateway.status}
                />
              </Td>
              <Td dataLabel={rightGateway.name}>
                <HealthStatus
                  appearance={
                    rightGateway.status === "Attention required"
                      ? "warning"
                      : "success"
                  }
                  label={rightGateway.status}
                />
              </Td>
            </Tr>
            {rows.map((row) => (
              <Tr key={row.field}>
                <Td dataLabel="Comparison field">{row.field}</Td>
                <Td dataLabel={leftGateway.name}>{row.left}</Td>
                <Td dataLabel={rightGateway.name}>{row.right}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}

export function GatewayCompareMockup({
  initialLeftGateway,
  initialRightGateway,
}: {
  initialLeftGateway?: string;
  initialRightGateway?: string;
}) {
  return (
    <MockupShell activeSection="gateway-compare">
      <PageSection hasBodyWrapper={false} variant="default">
        <Flex
          alignItems={{ default: "alignItemsCenter" }}
          justifyContent={{ default: "justifyContentSpaceBetween" }}
        >
          <FlexItem>
            <Content>
              <Title headingLevel="h1" size="2xl">
                Compare gateways
              </Title>
            </Content>
          </FlexItem>
          <FlexItem>
            <Flex
              alignItems={{ default: "alignItemsCenter" }}
              gap={{ default: "gapXs" }}
            >
              <span
                style={{
                  color: "var(--pf-t--global--text--color--subtle)",
                  fontSize: "var(--pf-t--global--font--size--sm)",
                  whiteSpace: "nowrap",
                }}
              >
                Last refreshed: 9:41 AM
              </span>
              <Button
                aria-label="Refresh gateway comparison"
                icon={<SyncAltIcon />}
                onClick={() => undefined}
                title="Refresh gateway comparison"
                variant="plain"
              />
            </Flex>
          </FlexItem>
        </Flex>
      </PageSection>
      <PageSection hasBodyWrapper={false} isFilled variant="secondary">
        <GatewayCompareContent
          initialLeftGateway={initialLeftGateway}
          initialRightGateway={initialRightGateway}
        />
      </PageSection>
    </MockupShell>
  );
}
