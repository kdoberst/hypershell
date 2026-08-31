import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";

import { describe, expect, it } from "vitest";

import {
  clusterPodsCapacityPromql,
  clusterPodsUsedPromql,
  queryClusterPods,
} from "../src/metrics-cluster-pods.js";

async function startPrometheusStub(
  handler: (request: IncomingMessage, response: ServerResponse) => void,
): Promise<{ close: () => void; port: number }> {
  const server = createServer(handler);
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("expected tcp listener address");
  }
  return {
    close: () => server.close(),
    port: address.port,
  };
}

function prometheusSample(value: string) {
  return JSON.stringify({
    status: "success",
    data: {
      result: [
        {
          metric: {},
          value: ["1704067200", value],
        },
      ],
    },
  });
}

describe("queryClusterPods", () => {
  it("maps Prometheus capacity and used samples into pod counts", async () => {
    const prometheus = await startPrometheusStub((request, response) => {
      const url = new URL(request.url ?? "", "http://127.0.0.1");
      const query = url.searchParams.get("query");
      response.setHeader("content-type", "application/json");
      if (query === clusterPodsCapacityPromql) {
        response.end(prometheusSample("2000"));
        return;
      }
      if (query === clusterPodsUsedPromql) {
        response.end(prometheusSample("548"));
        return;
      }
      response.statusCode = 400;
      response.end();
    });

    try {
      const pods = await queryClusterPods(
        `http://127.0.0.1:${String(prometheus.port)}`,
        5_000,
      );
      expect(pods).toEqual({
        available_pods: 1452,
        capacity_pods: 2000,
        used_pods: 548,
      });
    } finally {
      prometheus.close();
    }
  });

  it("fails when Prometheus returns no capacity samples", async () => {
    const prometheus = await startPrometheusStub((request, response) => {
      const url = new URL(request.url ?? "", "http://127.0.0.1");
      const query = url.searchParams.get("query");
      response.setHeader("content-type", "application/json");
      if (query === clusterPodsCapacityPromql) {
        response.end(
          JSON.stringify({
            status: "success",
            data: { result: [] },
          }),
        );
        return;
      }
      if (query === clusterPodsUsedPromql) {
        response.end(prometheusSample("548"));
        return;
      }
      response.statusCode = 400;
      response.end();
    });

    try {
      await expect(
        queryClusterPods(`http://127.0.0.1:${String(prometheus.port)}`, 5_000),
      ).rejects.toThrow("No cluster pod capacity data");
    } finally {
      prometheus.close();
    }
  });

  it("fails when used exceeds capacity", async () => {
    const prometheus = await startPrometheusStub((request, response) => {
      const url = new URL(request.url ?? "", "http://127.0.0.1");
      const query = url.searchParams.get("query");
      response.setHeader("content-type", "application/json");
      if (query === clusterPodsCapacityPromql) {
        response.end(prometheusSample("100"));
        return;
      }
      if (query === clusterPodsUsedPromql) {
        response.end(prometheusSample("101"));
        return;
      }
      response.statusCode = 400;
      response.end();
    });

    try {
      await expect(
        queryClusterPods(`http://127.0.0.1:${String(prometheus.port)}`, 5_000),
      ).rejects.toThrow("Inconsistent cluster pod samples");
    } finally {
      prometheus.close();
    }
  });
});
