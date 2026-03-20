const {
  createRoutingPolicy,
  resolveRoute,
  evaluateGatewayRequest,
} = require("../../../../../packages/domain-gateway/src/index.js");

/**
 * Routing service is the control-plane wrapper over gateway domain logic.
 * It keeps route previews and request-guard orchestration in one place.
 */
function createRoutingService() {
  function createPolicy(input) {
    return createRoutingPolicy(input);
  }

  function previewRoute({ routingPolicy, healthByTarget, tenantPinnedTarget = null }) {
    return resolveRoute({
      policy: routingPolicy,
      healthByTarget,
      tenantPinnedTarget,
    });
  }

  function evaluateRequest(input) {
    return evaluateGatewayRequest(input);
  }

  return {
    createPolicy,
    previewRoute,
    evaluateRequest,
  };
}

module.exports = {
  createRoutingService,
};
