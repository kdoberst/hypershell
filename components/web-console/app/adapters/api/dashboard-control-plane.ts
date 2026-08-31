import {
  aggregateGatewayDisplayStatusCounts,
  type GatewayDisplayStatusCounts,
} from "@openshift-online/hypershell-gateway-management-ui";
import type {
  DashboardControlPlane,
  DashboardInvocationContext,
  OperationalDashboardMetrics,
  OperationalMetric,
} from "@openshift-online/hypershell-operational-dashboard-ui";
import type { SDKClient } from "@openshift-online/hypershell-sdk";

type DashboardApiFactory = (correlationId: string) => SDKClient;

const gatewayListPageSize = 100;
const gibibyteDivisor = 1024 ** 3;

interface ClusterMemoryResponse {
  available_bytes: number;
  capacity_bytes: number;
  used_bytes: number;
}

interface ClusterCpuResponse {
  available_cores: number;
  capacity_cores: number;
  used_cores: number;
}

interface ClusterPodsResponse {
  available_pods: number;
  capacity_pods: number;
  used_pods: number;
}

function bytesToRoundedGib(bytes: number): string {
  return String(Math.round(bytes / gibibyteDivisor));
}

function coresToRoundedString(cores: number): string {
  return String(Math.round(cores));
}

async function fetchClusterMemoryMetric(
  signal?: AbortSignal,
): Promise<OperationalMetric> {
  const response = await fetch("/api/metrics/cluster-memory", {
    credentials: "same-origin",
    signal,
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch cluster memory metrics: ${String(response.status)}`,
    );
  }

  const body = (await response.json()) as ClusterMemoryResponse;

  return {
    id: "memory",
    total: bytesToRoundedGib(body.capacity_bytes),
    unit: "GiB",
    value: bytesToRoundedGib(body.used_bytes),
  };
}

async function fetchClusterCpuMetric(
  signal?: AbortSignal,
): Promise<OperationalMetric> {
  const response = await fetch("/api/metrics/cluster-cpu", {
    credentials: "same-origin",
    signal,
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch cluster CPU metrics: ${String(response.status)}`,
    );
  }

  const body = (await response.json()) as ClusterCpuResponse;

  return {
    id: "cpu",
    total: coresToRoundedString(body.capacity_cores),
    unit: "cores",
    value: coresToRoundedString(body.used_cores),
  };
}

async function fetchClusterPodsMetric(
  signal?: AbortSignal,
): Promise<OperationalMetric> {
  const response = await fetch("/api/metrics/cluster-pods", {
    credentials: "same-origin",
    signal,
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch cluster pods metrics: ${String(response.status)}`,
    );
  }

  const body = (await response.json()) as ClusterPodsResponse;

  return {
    id: "pods",
    total: String(body.capacity_pods),
    unit: "pods",
    value: String(body.used_pods),
  };
}

function gatewayDisplayCountsToMetric(
  total: number,
  counts: GatewayDisplayStatusCounts,
): OperationalMetric {
  return {
    id: "provisioned-gateways",
    status: {
      degraded: counts.degraded,
      failed: counts.failed,
      healthy: counts.healthy,
      provisioning: counts.provisioning,
    },
    value: String(total),
  };
}

interface GatewayListAggregate {
  activeSandboxCount: number;
  displayStatusCounts: GatewayDisplayStatusCounts;
  total: number;
}

async function aggregateGatewayList(
  context: DashboardInvocationContext,
  apiFactory: DashboardApiFactory,
): Promise<GatewayListAggregate> {
  const client = apiFactory(context.correlationId);
  let page = 1;
  let total = 0;
  let activeSandboxCount = 0;
  const lifecycleRecords: { phase?: string; status?: string }[] = [];

  do {
    const result = await client.gateways.list(
      {
        orderBy: "name asc",
        page,
        size: gatewayListPageSize,
      },
      { signal: context.signal },
    );

    if (
      result.page !== page ||
      result.total < 0 ||
      result.items.length >
        Math.max(
          0,
          Math.min(
            gatewayListPageSize,
            result.total - (page - 1) * gatewayListPageSize,
          ),
        )
    ) {
      throw new Error("Gateway list response was inconsistent");
    }

    for (const gateway of result.items) {
      activeSandboxCount += gateway.active_sandbox_count;
      lifecycleRecords.push({
        phase: gateway.phase,
        status: gateway.status,
      });
    }

    total = result.total;
    page += 1;
  } while ((page - 1) * gatewayListPageSize < total);

  return {
    activeSandboxCount,
    displayStatusCounts: aggregateGatewayDisplayStatusCounts(lifecycleRecords),
    total,
  };
}

export function createDashboardControlPlaneAdapter(
  apiFactory: DashboardApiFactory,
): DashboardControlPlane {
  return {
    async getOperationalMetrics(
      context: DashboardInvocationContext,
    ): Promise<OperationalDashboardMetrics> {
      context.signal?.throwIfAborted();

      const aggregate = await aggregateGatewayList(context, apiFactory);
      const client = apiFactory(context.correlationId);
      const [userList, memoryMetric, cpuMetric, podsMetric] = await Promise.all([
        client.users.list(
          { orderBy: "username asc", page: 1, size: 1 },
          { signal: context.signal },
        ),
        fetchClusterMemoryMetric(context.signal),
        fetchClusterCpuMetric(context.signal),
        fetchClusterPodsMetric(context.signal),
      ]);

      const metrics: OperationalMetric[] = [
        gatewayDisplayCountsToMetric(
          aggregate.total,
          aggregate.displayStatusCounts,
        ),
      ];

      metrics.push({
        id: "provisioned-sandboxes",
        value: String(aggregate.activeSandboxCount),
      });

      metrics.push({
        id: "registered-users",
        value: String(userList.total),
      });

      metrics.push(memoryMetric);
      metrics.push(cpuMetric);
      metrics.push(podsMetric);

      return {
        lastSuccessfulRefresh: new Date(),
        metrics,
      };
    },
  };
}
