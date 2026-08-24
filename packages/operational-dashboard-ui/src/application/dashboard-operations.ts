import type {
  DashboardControlPlane,
  DashboardOperations,
  DashboardWorkflowRuntime,
} from "./dashboard-types";

export interface DashboardOperationDependencies {
  controlPlane: DashboardControlPlane;
  runtime?: DashboardWorkflowRuntime;
}

const defaultRuntime: DashboardWorkflowRuntime = {
  createCorrelationId: () => crypto.randomUUID(),
};

export function createDashboardOperations({
  controlPlane,
  runtime = defaultRuntime,
}: DashboardOperationDependencies): DashboardOperations {
  return {
    getOperationalMetrics: (signal) =>
      controlPlane.getOperationalMetrics({
        correlationId: runtime.createCorrelationId(),
        signal,
      }),
  };
}
