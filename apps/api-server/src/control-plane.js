const { createAuthService } = require("./modules/auth/service.js");
const { createProjectService } = require("./modules/project/service.js");
const { createRoutingService } = require("./modules/routing/service.js");
const { createBillingService } = require("./modules/billing/service.js");
const { createSettlementService } = require("./modules/settlement/service.js");
const { createRiskControlService } = require("./modules/risk-control/service.js");

/**
 * Control-plane facade is a simple integration surface for early development.
 * It gives the repository one place to preview the whole request lifecycle.
 */
function createControlPlane() {
  return {
    auth: createAuthService(),
    project: createProjectService(),
    routing: createRoutingService(),
    billing: createBillingService(),
    settlement: createSettlementService(),
    riskControl: createRiskControlService(),
  };
}

module.exports = {
  createControlPlane,
};
