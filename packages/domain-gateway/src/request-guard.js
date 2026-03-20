const { evaluateApiKeyAccess } = require("../../domain-auth/src/policy.js");
const { evaluateBudgetUsage } = require("../../domain-customer/src/budget.js");
const { resolveRoute } = require("./routing-policy.js");

/**
 * This composes auth, quota, and routing checks into one readable decision.
 * It mirrors the order we want in a real gateway request path.
 */
function evaluateGatewayRequest({
  apiKeyPolicy,
  budget,
  routingPolicy,
  request,
  estimatedCharge,
  healthByTarget,
  tenantPinnedTarget = null,
}) {
  const apiKeyResult = evaluateApiKeyAccess({
    policy: apiKeyPolicy,
    model: request.model,
    ipAddress: request.ipAddress,
    requestsInCurrentMinute: request.requestsInCurrentMinute,
  });

  if (!apiKeyResult.allowed) {
    return { allowed: false, stage: "api_key", reason: apiKeyResult.reason };
  }

  const budgetResult = evaluateBudgetUsage({
    budget,
    estimatedCharge,
  });

  if (!budgetResult.allowed) {
    return { allowed: false, stage: "budget", reason: budgetResult.status };
  }

  const routeResult = resolveRoute({
    policy: routingPolicy,
    healthByTarget,
    tenantPinnedTarget,
  });

  if (!routeResult.target) {
    return { allowed: false, stage: "routing", reason: routeResult.reason };
  }

  return {
    allowed: true,
    stage: "routed",
    reason: routeResult.reason,
    target: routeResult.target,
    budgetStatus: budgetResult.status,
  };
}

module.exports = {
  evaluateGatewayRequest,
};
