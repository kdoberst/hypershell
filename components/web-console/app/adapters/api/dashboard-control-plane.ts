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
  const lifecycleRecords: Array<{ phase?: string; status?: string }> = [];

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

      return {
        lastSuccessfulRefresh: new Date(),
        metrics,
      };
    },
  };
}
