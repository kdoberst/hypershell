import { createDashboardOperations } from "@openshift-online/hypershell-operational-dashboard-ui";

import { createMockDashboardControlPlane } from "../adapters/mock/dashboard-control-plane";

export const dashboardOperations = createDashboardOperations({
  controlPlane: createMockDashboardControlPlane(),
});
