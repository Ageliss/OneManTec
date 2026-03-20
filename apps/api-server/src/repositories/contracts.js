/**
 * Repository contracts make the data access boundary visible before a real DB adapter exists.
 * These are shape checks, not runtime interfaces.
 */
function ensureRepositoryContract(repository) {
  const requiredMethods = [
    "getTenantById",
    "getProjectById",
    "getApiKeyById",
    "getApiKeyPolicyByKeyId",
    "getQuotaPolicyByProjectId",
    "getRoutingRuleByProjectAndAlias",
    "getDefaultPricingRule",
    "getRouteHealth",
    "getRiskPolicyByProjectId",
  ];

  const missing = requiredMethods.filter(
    (methodName) => typeof repository[methodName] !== "function",
  );

  return {
    valid: missing.length === 0,
    missing,
  };
}

module.exports = {
  ensureRepositoryContract,
};
