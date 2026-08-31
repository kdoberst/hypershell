import type { Gateway, GatewayList } from "@openshift-online/hypershell-sdk";
import { describe, expect, it, vi } from "vitest";

import { createDashboardControlPlaneAdapter } from "./dashboard-control-plane";

const gatewayListApi = vi.fn();
const usersListApi = vi.fn();
const apiFactory = vi.fn(() => ({
  gateways: {
    list: gatewayListApi,
  },
  users: {
    list: usersListApi,
  },
}));

const adapter = createDashboardControlPlaneAdapter(apiFactory);
const context = {
  correlationId: "11111111-1111-4111-8111-111111111111",
};

function gateway(overrides: Partial<Gateway> = {}): Gateway {
  return {
    active_sandbox_count: 2,
    cluster_id: "",
    console_address: "",
    created_at: null,
    created_by: "",
    credential_driver: "",
    database_id: "database-1",
    external_dns: "gateway.example.com",
    fleet_id: "",
    href: "/api/hypershell/v1/gateways/gateway-1",
    id: "gateway-1",
    image: "",
    kind: "Gateway",
    name: "Team gateway",
    namespace: "openshell",
    oidc: "",
    phase: "Running",
    release_id: "release-1",
    route: "",
    route_address: "",
    server_dns_names: "",
    service_type: "",
    status: "Healthy",
    supervisor_image: "",
    tls_mode: "",
    updated_at: null,
    ...overrides,
  };
}

function gatewayList(
  items: Gateway[],
  total = items.length,
  page = 1,
): GatewayList {
  return {
    items,
    kind: "GatewayList",
    page,
    size: items.length,
    total,
  };
}

describe("createDashboardControlPlaneAdapter", () => {
  it("aggregates paginated gateway lists into operational metrics", async () => {
    usersListApi.mockResolvedValueOnce({
      items: [],
      kind: "UserList",
      page: 1,
      size: 1,
      total: 42,
    });

    const firstPage = Array.from({ length: 100 }, (_, index) =>
      gateway({
        active_sandbox_count: 1,
        id: `gateway-${String(index)}`,
        phase: "Running",
        status: "Healthy",
      }),
    );
    const secondPage = Array.from({ length: 50 }, (_, index) =>
      gateway({
        active_sandbox_count: 2,
        id: `gateway-${String(index + 100)}`,
        phase: "Provisioning",
        status: "route pending",
      }),
    );

    gatewayListApi
      .mockResolvedValueOnce(gatewayList(firstPage, 150, 1))
      .mockResolvedValueOnce(gatewayList(secondPage, 150, 2));

    const metrics = await adapter.getOperationalMetrics(context);

    expect(gatewayListApi).toHaveBeenCalledTimes(2);
    expect(gatewayListApi).toHaveBeenNthCalledWith(
      1,
      { orderBy: "name asc", page: 1, size: 100 },
      { signal: undefined },
    );
    expect(gatewayListApi).toHaveBeenNthCalledWith(
      2,
      { orderBy: "name asc", page: 2, size: 100 },
      { signal: undefined },
    );

    const gatewaysMetric = metrics.metrics.find(
      (metric) => metric.id === "provisioned-gateways",
    );
    const sandboxesMetric = metrics.metrics.find(
      (metric) => metric.id === "provisioned-sandboxes",
    );
    const registeredUsersMetric = metrics.metrics.find(
      (metric) => metric.id === "registered-users",
    );

    expect(gatewaysMetric?.value).toBe("150");
    expect(gatewaysMetric?.status).toEqual({
      degraded: 0,
      failed: 0,
      healthy: 100,
      provisioning: 50,
    });
    expect(sandboxesMetric?.value).toBe("200");
    expect(registeredUsersMetric?.value).toBe("42");
    expect(usersListApi).toHaveBeenCalledWith(
      { orderBy: "username asc", page: 1, size: 1 },
      { signal: undefined },
    );
  });

  it("maps gateway lifecycle fields into display-status buckets", async () => {
    usersListApi.mockResolvedValueOnce({
      items: [],
      kind: "UserList",
      page: 1,
      size: 1,
      total: 0,
    });

    gatewayListApi.mockResolvedValueOnce(
      gatewayList(
        [
          gateway({ phase: "Running", status: "Healthy" }),
          gateway({ phase: "Degraded", status: "CrashLoopBackOff" }),
          gateway({ phase: "Failed", status: "apply error" }),
        ],
        3,
        1,
      ),
    );

    const metrics = await adapter.getOperationalMetrics(context);
    const gatewaysMetric = metrics.metrics.find(
      (metric) => metric.id === "provisioned-gateways",
    );

    expect(gatewaysMetric?.status).toEqual({
      degraded: 1,
      failed: 1,
      healthy: 1,
      provisioning: 0,
    });
  });

  it("rejects inconsistent pagination responses", async () => {
    usersListApi.mockResolvedValueOnce({
      items: [],
      kind: "UserList",
      page: 1,
      size: 1,
      total: 0,
    });
    gatewayListApi.mockResolvedValueOnce(gatewayList([gateway()], 1, 2));

    await expect(adapter.getOperationalMetrics(context)).rejects.toThrow(
      "Gateway list response was inconsistent",
    );
  });

  it("forwards abort signals to the gateway list client", async () => {
    const controller = new AbortController();
    usersListApi.mockResolvedValueOnce({
      items: [],
      kind: "UserList",
      page: 1,
      size: 1,
      total: 0,
    });
    gatewayListApi.mockResolvedValueOnce(gatewayList([gateway()], 1, 1));

    await adapter.getOperationalMetrics({
      ...context,
      signal: controller.signal,
    });

    expect(gatewayListApi).toHaveBeenCalledWith(
      { orderBy: "name asc", page: 1, size: 100 },
      { signal: controller.signal },
    );
    expect(usersListApi).toHaveBeenCalledWith(
      { orderBy: "username asc", page: 1, size: 1 },
      { signal: controller.signal },
    );
  });
});
