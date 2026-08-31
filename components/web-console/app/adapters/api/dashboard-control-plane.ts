import {
  fetchGatewayMetrics,
  type GatewayPhaseCounts,
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

function gatewayPhaseCountsToMetric(
  counts: GatewayPhaseCounts,
): OperationalMetric {
  const total =
    counts.Running + counts.Provisioning + counts.Degraded + counts.Failed;

  return {
    id: "provisioned-gateways",
    status: {
      degraded: counts.Degraded,
      failed: counts.Failed,
      provisioning: counts.Provisioning,
      running: counts.Running,
    },
    value: String(total),
  };
}

async function sumActiveSandboxCount(
  context: DashboardInvocationContext,
  apiFactory: DashboardApiFactory,
): Promise<number> {
  const client = apiFactory(context.correlationId);
  let page = 1;
  let total = 0;
  let sum = 0;

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
      sum += gateway.active_sandbox_count;
    }

    total = result.total;
    page += 1;
  } while ((page - 1) * gatewayListPageSize < total);

  return sum;
}

export function createDashboardControlPlaneAdapter(
  apiFactory: DashboardApiFactory,
): DashboardControlPlane {
  return {
    async getOperationalMetrics(
      context: DashboardInvocationContext,
    ): Promise<OperationalDashboardMetrics> {
      context.signal?.throwIfAborted();

      const counts = await fetchGatewayMetrics(context.signal);
      const metrics: OperationalMetric[] = [gatewayPhaseCountsToMetric(counts)];

      try {
        const sandboxCount = await sumActiveSandboxCount(context, apiFactory);
        metrics.push({
          id: "provisioned-sandboxes",
          value: String(sandboxCount),
        });
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          error.name === "AbortError"
        ) {
          throw error;
        }
        // Sandbox totals are advisory; gateway phase counts remain the primary signal.
      }

      return {
        lastSuccessfulRefresh: new Date(),
        metrics,
      };
    },
  };
}
