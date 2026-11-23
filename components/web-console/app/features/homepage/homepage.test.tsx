import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IntlProvider } from "react-intl";
import { MemoryRouter, useLocation } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { externalLinkUrls } from "@openshift-online/hypershell-gateway-management-ui";

import type {
  HomepagePlatformOverview,
  HomepageSummary,
} from "../../adapters/api/homepage";
import { englishMessages } from "../../i18n/catalog";
import {
  homepageAnnouncementExample,
  type HomepageAnnouncement,
} from "./announcement";
import { HomepagePageSurface } from "./homepage";

vi.mock("./use-homepage", () => ({
  useHomepagePlatformOverview: vi.fn(),
  useHomepageSummary: vi.fn(),
  useQuickCreateGateway: vi.fn(),
}));

vi.mock("../shell/use-session", () => ({
  useSession: vi.fn(),
}));

function CurrentPath() {
  const { pathname } = useLocation();
  return <span data-testid="current-path">{pathname}</span>;
}

const summary: HomepageSummary = {
  quickCreate: {
    placement: {
      excludedSelector: ["runtime/kata"],
      selector: ["network/public", "provider/ibm"],
    },
  },
  gatewayHealth: {
    attention: [
      {
        gatewayId: "gateway-17",
        name: "research-gateway",
        reason: "Connection health is degraded",
        status: "Degraded",
      },
    ],
    attentionCount: 1,
    healthy: 4,
    total: 5,
  },
};

const overview: HomepagePlatformOverview = {
  clusters: {
    healthy: 5,
    total: 6,
    unhealthyClusters: [
      {
        name: "production-central",
        reason: "Cluster heartbeat is stale",
        status: "Unavailable",
      },
    ],
  },
  gatewayStatuses: {
    available: true,
    counts: { Failed: 2, Provisioning: 5, Running: 35 },
    total: 42,
  },
  sandboxStatuses: {
    available: true,
    counts: { active: 112, expiring: 9, idle: 5, orphaned: 2 },
    total: 128,
  },
};

function renderSurface({
  announcement,
  isAdmin = true,
  platformOverview = overview,
  sessionIsLoading = false,
  summaryIsLoading = false,
  summaryValue = summary,
  quickCreatePlacement = summary.quickCreate,
  quickCreateOpen = false,
  quickCreateUnavailable = false,
}: {
  announcement?: HomepageAnnouncement | null;
  isAdmin?: boolean;
  platformOverview?: HomepagePlatformOverview;
  sessionIsLoading?: boolean;
  summaryValue?: HomepageSummary;
  summaryIsLoading?: boolean;
  quickCreatePlacement?: HomepageSummary["quickCreate"];
  quickCreateOpen?: boolean;
  quickCreateUnavailable?: boolean;
} = {}) {
  return render(
    <IntlProvider locale="en" messages={englishMessages}>
      <MemoryRouter>
        <HomepagePageSurface
          announcement={announcement}
          isAdmin={isAdmin}
          platformOverview={platformOverview}
          platformOverviewIsLoading={false}
          quickCreatePlacement={
            quickCreateUnavailable ? undefined : quickCreatePlacement
          }
          quickCreate={() => undefined}
          quickCreateError={false}
          quickCreateIsPending={false}
          quickCreateOpen={quickCreateOpen}
          sessionIsLoading={sessionIsLoading}
          setQuickCreateOpen={() => undefined}
          summary={summaryValue}
          summaryIsLoading={summaryIsLoading}
        />
        <CurrentPath />
      </MemoryRouter>
    </IntlProvider>,
  );
}

describe("HomepagePageSurface", () => {
  it("renders a configured homepage announcement", () => {
    renderSurface({ announcement: homepageAnnouncementExample });

    expect(screen.getByText("Scheduled downtime")).toBeTruthy();
    expect(
      screen.getByText(
        "HyperShell will be unavailable on Oct 24 from 02:00 to 03:00 CT while we upgrade the platform.",
      ),
    ).toBeTruthy();
  });

  it("hides the homepage announcement by default", () => {
    renderSurface();

    expect(screen.queryByText("Scheduled downtime")).toBeNull();
  });

  it("renders API-backed summary and platform values", () => {
    renderSurface();

    expect(screen.getByText("research-gateway")).toBeTruthy();
    expect(screen.getByText("Connection health is degraded")).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "research-gateway" })
        .getAttribute("href"),
    ).toBe("/gateways/gateway-17?attention=gateway-health");
    expect(
      screen.getByText("Talk to the team in #forum-hypershell"),
    ).toBeTruthy();
    expect(screen.getByText("Cluster heartbeat is stale")).toBeTruthy();
    expect(screen.getByText("42")).toBeTruthy();
    expect(screen.getByText("128")).toBeTruthy();
  });

  it.each([
    { role: "administrator", isAdmin: true },
    { role: "non-administrator", isAdmin: false },
  ])(
    "uses a role-neutral gateway health link for $role",
    async ({ isAdmin }) => {
      const user = userEvent.setup();
      renderSurface({
        isAdmin,
        platformOverview: isAdmin ? overview : undefined,
      });

      const gatewayLinks = screen.getAllByRole("link", {
        name: "View gateways",
      });
      expect(gatewayLinks).toHaveLength(2);
      const healthLink = gatewayLinks.at(-1);
      expect(healthLink).toBeDefined();
      if (healthLink === undefined) return;
      expect(healthLink.tagName).toBe("A");
      expect(healthLink.getAttribute("href")).toBe("/gateways");

      for (
        let index = 0;
        index < 20 && document.activeElement !== healthLink;
        index++
      ) {
        await user.tab();
      }
      expect(document.activeElement).toBe(healthLink);
      await user.keyboard("{Enter}");
      expect(screen.getByTestId("current-path").textContent).toBe("/gateways");
    },
  );

  it("renders the non-administrator dashboard card", () => {
    renderSurface({ isAdmin: false, platformOverview: undefined });

    expect(screen.getByText("Your dashboard")).toBeTruthy();
    expect(screen.queryByText("Platform overview")).toBeNull();
  });

  it("hides Quick Create when no placement is available", () => {
    renderSurface({ quickCreateUnavailable: true });

    expect(screen.queryByText("Quick create")).toBeNull();
    expect(screen.getByText("Create a gateway")).toBeTruthy();
  });

  it("describes the Kind Quick Create placement", () => {
    renderSurface({
      quickCreateOpen: true,
      quickCreatePlacement: { placement: { selector: ["provider/kind"] } },
    });

    expect(
      screen.getByText(
        "Quick create makes a gateway on the local Kind cluster with a generated name. You can rename it after it starts.",
      ),
    ).toBeTruthy();
  });

  it("keeps the role card neutral while the session loads", () => {
    renderSurface({ sessionIsLoading: true });

    expect(screen.getByText("Dashboard")).toBeTruthy();
    expect(screen.queryByText("Your dashboard")).toBeNull();
    expect(screen.queryByText("Platform overview")).toBeNull();
  });

  it("isolates a failed platform source", () => {
    renderSurface({
      platformOverview: {
        clusters: overview.clusters,
        gatewayStatuses: overview.gatewayStatuses,
        sandboxStatuses: { available: false },
      },
    });

    expect(screen.getByText("42")).toBeTruthy();
    expect(
      screen.getAllByText("Platform overview is unavailable").length,
    ).toBeGreaterThan(0);
  });

  it("omits zero-value statuses and legends for empty donuts", () => {
    const { container } = renderSurface({
      platformOverview: {
        ...overview,
        gatewayStatuses: {
          available: true,
          counts: { Pending: 0, Provisioning: 0, Running: 0 },
          total: 0,
        },
        sandboxStatuses: {
          available: true,
          counts: { active: 0, expiring: 0 },
          total: 0,
        },
      },
    });

    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
    expect(screen.queryByText("Pending:0")).toBeNull();
    expect(screen.queryByText("Provisioning:0")).toBeNull();
    expect(screen.queryByText("Running:0")).toBeNull();
    expect(screen.queryByText("active:0")).toBeNull();
    expect(screen.queryByText("expiring:0")).toBeNull();
    expect(
      container.querySelectorAll("div[style*='width: 300px']").length,
    ).toBe(2);
  });

  it("marks unavailable clusters with a warning icon", () => {
    const { container } = renderSurface();

    expect(
      container.querySelector(".pf-v6-c-icon__content.pf-m-warning svg"),
    ).toBeTruthy();
  });

  it("renders gateway attention status with the shared warning icon", () => {
    const { container } = renderSurface();

    expect(screen.getByText("Degraded")).toBeTruthy();
    expect(
      container.querySelector(".pf-v6-c-icon__content.pf-m-warning svg"),
    ).toBeTruthy();
  });

  it("renders failed gateway health with a danger icon", () => {
    const { container } = renderSurface({
      summaryValue: {
        gatewayHealth: {
          attention: [
            {
              gatewayId: "gateway-18",
              name: "failed-gateway",
              reason: "Connection failed",
              status: "Failed",
            },
          ],
          attentionCount: 1,
          healthy: 0,
          total: 1,
        },
      },
    });

    expect(
      container.querySelector(".pf-v6-c-icon__content.pf-m-danger svg"),
    ).toBeTruthy();
  });

  it("renders the unavailable cluster label exactly once", () => {
    renderSurface();

    expect(screen.getAllByText("Unavailable").length).toBe(1);
  });

  it("links gateway needs attention to the gateway context", () => {
    renderSurface();

    expect(
      screen
        .getByRole("link", { name: "research-gateway" })
        .getAttribute("href"),
    ).toBe("/gateways/gateway-17?attention=gateway-health");
  });

  it("shows the support link when summary data is unavailable", () => {
    renderSurface({
      summaryValue: { gatewayHealth: { available: false } },
    });

    expect(screen.getByText("Gateway status is unavailable")).toBeTruthy();
    expect(
      screen.getByText("Talk to the team in #forum-hypershell"),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Open in Slack" }).getAttribute("href"),
    ).toBe(externalLinkUrls.supportSlackChannel);
  });

  it("renders a healthy gateway summary", () => {
    renderSurface({
      summaryValue: {
        gatewayHealth: {
          attention: [],
          attentionCount: 0,
          healthy: 3,
          total: 3,
        },
      },
    });

    expect(screen.getByText("All 3 gateways are healthy")).toBeTruthy();
  });

  it("uses singular and empty-state gateway health messages", () => {
    renderSurface({
      summaryValue: {
        gatewayHealth: {
          attention: [],
          attentionCount: 0,
          healthy: 1,
          total: 1,
        },
      },
    });

    expect(screen.getByText("1 gateway is healthy")).toBeTruthy();

    renderSurface({
      summaryValue: {
        gatewayHealth: {
          attention: [],
          attentionCount: 0,
          healthy: 0,
          total: 0,
        },
      },
    });

    expect(screen.getByText("No gateways yet")).toBeTruthy();
  });

  it("renders a stable gateway-summary loading state", () => {
    renderSurface({ summaryIsLoading: true });

    expect(screen.getByLabelText("Loading")).toBeTruthy();
  });
});
