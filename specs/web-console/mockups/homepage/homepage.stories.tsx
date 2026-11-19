import type { Meta, StoryObj } from "@storybook/react-vite";

import { MockupShell } from "../shell/mockup-template";
import { HomepagePageSurface, type HomepageState } from "./homepage";

function HomepageMockup({ state = "loaded" }: { state?: HomepageState }) {
  return (
    <MockupShell activeSection="overview">
      <HomepagePageSurface state={state} />
    </MockupShell>
  );
}

const meta = {
  title: "Mockups/Homepage",
  component: HomepageMockup,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof HomepageMockup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = {
  args: { state: "loaded" },
};

export const Announcement: Story = {
  args: { state: "announcement" },
};

export const PartialData: Story = {
  args: { state: "partial" },
};

export const ClusterError: Story = {
  args: { state: "clusterError" },
};

export const ClusterWarning: Story = {
  args: { state: "clusterWarning" },
};

export const NothingNeedsAttention: Story = {
  args: { state: "noAttention" },
};

export const PlatformRestricted: Story = {
  args: { state: "platformRestricted" },
};
