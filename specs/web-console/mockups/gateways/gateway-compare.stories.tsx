import type { Meta, StoryObj } from "@storybook/react-vite";

import { GatewayCompareMockup } from "./gateway-compare";

const meta = {
  title: "Mockups/Gateways/Gateway compare",
  component: GatewayCompareMockup,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof GatewayCompareMockup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = {
  args: {
    initialLeftGateway: "payments-gateway",
    initialRightGateway: "research-gateway",
  },
};

export const AttentionRequired: Story = {
  args: {
    initialLeftGateway: "payments-gateway",
    initialRightGateway: "integrations-gateway",
  },
};
