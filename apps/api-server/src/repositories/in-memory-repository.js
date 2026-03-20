const { createSeedData } = require("./in-memory-data.js");

/**
 * This repository is intentionally small and synchronous.
 * Its purpose is to let the control-plane HTTP layer evolve before a real DB client is wired in.
 */
function createInMemoryRepository(seed = createSeedData()) {
  return {
    getTenantById(tenantId) {
      return seed.tenants.find((tenant) => tenant.id === tenantId) ?? null;
    },

    getProjectById(projectId) {
      return seed.projects.find((project) => project.id === projectId) ?? null;
    },

    getApiKeyById(apiKeyId) {
      return seed.apiKeys.find((apiKey) => apiKey.id === apiKeyId) ?? null;
    },

    getApiKeyPolicyByKeyId(apiKeyId) {
      return seed.apiKeyPolicies.find((policy) => policy.apiKeyId === apiKeyId) ?? null;
    },

    getQuotaPolicyByProjectId(projectId) {
      return seed.quotaPolicies.find((policy) => policy.projectId === projectId) ?? null;
    },

    getRoutingRuleByProjectAndAlias(projectId, modelAlias) {
      return (
        seed.routingRules.find(
          (rule) =>
            rule.projectId === projectId &&
            rule.modelAlias === modelAlias &&
            rule.isEnabled === true,
        ) ?? null
      );
    },

    getDefaultPricingRule() {
      return seed.pricingRules[0] ?? null;
    },

    getRouteHealth() {
      return seed.routeHealth;
    },

    getRiskPolicyByProjectId(projectId) {
      return seed.riskPolicies.find((policy) => policy.projectId === projectId) ?? null;
    },
  };
}

module.exports = {
  createInMemoryRepository,
};
