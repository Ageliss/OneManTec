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
        tokenValue: "omtk_demo_key",
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
    models: [
      {
        id: "deepseek-chat",
        displayName: "DeepSeek Chat",
        provider: "onemantec",
        capabilities: ["chat", "stream"],
        visibility: "public",
      },
    ],
    nodes: [
      { id: "node-a", region: "cn-east", health: "healthy", gpuCount: 8 },
      { id: "node-b", region: "cn-east", health: "degraded", gpuCount: 8 },
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
    deployments: [
      {
        id: "dep-demo",
        projectId: "project-demo",
        modelAlias: "deepseek-chat",
        status: "running",
        endpoint: "http://node-a/v1/chat/completions",
        targetNode: "node-a",
      },
    ],
    deploymentTasks: [
      {
        id: "task-demo",
        deploymentId: "dep-demo",
        projectId: "project-demo",
        taskType: "deploy",
        status: "pending",
        nodeId: "node-a",
        modelAlias: "deepseek-chat",
        modelPath: "/models/deepseek-chat",
        image: "lmsysorg/sglang:latest",
        requestedGpuCount: 1,
        requestedPort: 30000,
        tensorParallelSize: 1,
        runtimeConfig: {
          maxRunningRequests: 64,
          schedulerHints: {
            zone: "cn-east-a",
          },
        },
      },
    ],
    deploymentTaskEvents: [
      {
        id: "task-event-demo",
        taskId: "task-demo",
        status: "pending",
        eventType: "task_created",
        message: "Deployment task created and waiting for scheduler pickup",
        payload: {
          source: "admin-console",
        },
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
