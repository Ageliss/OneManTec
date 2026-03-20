function createSeedData() {
  return {
    tenants: [
      { id: "tenant-demo", name: "Demo Tenant", status: "active", billingMode: "prepaid" },
    ],
    projects: [
      {
        id: "project-demo",
        tenantId: "tenant-demo",
        name: "Demo Project",
        environment: "prod",
        status: "active",
      },
    ],
    apiKeys: [
      {
        id: "key-demo",
        tenantId: "tenant-demo",
        projectId: "project-demo",
        keyPrefix: "omtk_demo",
        keyHash: "hashed-demo",
        status: "active",
      },
    ],
    apiKeyPolicies: [
      {
        id: "policy-demo",
        apiKeyId: "key-demo",
        allowedModels: ["deepseek-chat"],
        allowedIps: [],
        blockedIps: [],
        maxRequestsPerMinute: 120,
        status: "active",
      },
    ],
    quotaPolicies: [
      {
        id: "quota-demo",
        tenantId: "tenant-demo",
        projectId: "project-demo",
        monthlyLimit: 500,
        softLimitRatio: 0.8,
        hardStop: true,
        spentThisMonth: 120,
      },
    ],
    routingRules: [
      {
        id: "route-demo",
        projectId: "project-demo",
        modelAlias: "deepseek-chat",
        preferredTargets: ["node-a", "node-b"],
        isEnabled: true,
      },
    ],
    routeHealth: {
      "node-a": "healthy",
      "node-b": "degraded",
    },
    pricingRules: [
      {
        id: "price-demo",
        productCode: "shared-chat",
        version: 1,
        inputTokenPrice: 0.001,
        outputTokenPrice: 0.002,
        requestBasePrice: 0.01,
        currency: "USD",
      },
    ],
    riskPolicies: [
      {
        id: "risk-demo",
        projectId: "project-demo",
        maxRequestsPerMinute: 300,
        maxSingleRequestCharge: 50,
      },
    ],
  };
}

module.exports = {
  createSeedData,
};
