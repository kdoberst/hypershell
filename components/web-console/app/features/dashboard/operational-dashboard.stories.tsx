import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  createDashboardOperations,
  DashboardUiProvider,
  mockOperationalDashboardMetrics,
  OperationalDashboardPage,
  type DashboardUiNavigation,
} from "@openshift-online/hypershell-operational-dashboard-ui";
import { IntlProvider } from "react-intl";
import { MemoryRouter, Route, Routes } from "react-router";

import { createMockDashboardControlPlane } from "../../adapters/mock/dashboard-control-plane";
import { englishMessages } from "../../i18n/catalog";
import { ApplicationShell } from "../shell/application-shell";

const stubNavigation: DashboardUiNavigation = {
  collectionHref: "/",
  navigate: () => {},
};

const stubDashboard = createDashboardOperations({
  controlPlane: {
    getOperationalMetrics: (context) => {
      context.signal?.throwIfAborted();
      return Promise.resolve(mockOperationalDashboardMetrics);
    },
  },
});

const mockDashboard = createDashboardOperations({
  controlPlane: createMockDashboardControlPlane(),
});

function DashboardPreview({
  metrics,
  useQuery = false,
}: Readonly<{
  metrics?: typeof mockOperationalDashboardMetrics;
  useQuery?: boolean;
}>) {
  return (
    <DashboardUiProvider
      dashboard={useQuery ? mockDashboard : stubDashboard}
      navigation={stubNavigation}
    >
      <OperationalDashboardPage metrics={metrics} />
    </DashboardUiProvider>
  );
}

function ShellDashboardPreview() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<ApplicationShell />}>
          <Route
            path="/"
            element={
              <OperationalDashboardPage metrics={mockOperationalDashboardMetrics} />
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

const pseudoMessages = Object.fromEntries(
  Object.entries(englishMessages).map(([id, message]) => [
    id,
    `［${message.replaceAll("a", "à").replaceAll("e", "ë")}］`,
  ]),
);

const meta = {
  title: "HyperShell/Operational dashboard",
  component: OperationalDashboardPage,
  parameters: {
    layout: "fullscreen",
  },
  render: () => <DashboardPreview metrics={mockOperationalDashboardMetrics} />,
} satisfies Meta<typeof OperationalDashboardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MockedMetrics: Story = {};

export const WithRefresh: Story = {
  render: () => <DashboardPreview useQuery />,
};

export const InShell: Story = {
  render: () => <ShellDashboardPreview />,
};

export const PseudoLocalized: Story = {
  decorators: [
    (StoryComponent) => (
      <IntlProvider locale="en-XA" messages={pseudoMessages}>
        <StoryComponent />
      </IntlProvider>
    ),
  ],
};

export const RightToLeft: Story = {
  decorators: [
    (StoryComponent) => (
      <div dir="rtl" lang="ar">
        <IntlProvider locale="ar" messages={englishMessages}>
          <StoryComponent />
        </IntlProvider>
      </div>
    ),
  ],
};
