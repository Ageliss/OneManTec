const test = require("node:test");
const assert = require("node:assert/strict");

const { createPrismaRepository } = require("./prisma-repository.js");

test("prisma repository maps contract methods to prisma delegates", async () => {
  const prisma = {
    tenant: { findUnique: async () => ({ id: "tenant-1" }) },
    project: { findUnique: async () => ({ id: "project-1" }) },
    modelCatalog: { findMany: async () => [] },
    nodeInventory: { findMany: async () => [{ id: "node-a", health: "healthy" }] },
    apiKey: {
      findUnique: async () => ({ id: "key-1" }),
      findFirst: async () => ({ id: "key-1" }),
    },
    apiKeyPolicy: { findFirst: async () => ({ id: "policy-1" }) },
    quotaPolicy: { findFirst: async () => ({ id: "quota-1" }) },
    routingRule: { findFirst: async () => ({ id: "route-1" }) },
    planPrice: { findFirst: async () => ({ id: "price-1" }) },
    riskPolicy: { findFirst: async () => ({ id: "risk-1" }) },
    deploymentRecord: { findMany: async () => [{ id: "dep-1" }] },
  };

  const repository = createPrismaRepository(prisma);
  const routeHealth = await repository.getRouteHealth();

  assert.equal((await repository.getTenantById("tenant-1")).id, "tenant-1");
  assert.equal((await repository.getProjectById("project-1")).id, "project-1");
  assert.equal((await repository.getApiKeyById("key-1")).id, "key-1");
  assert.equal((await repository.getApiKeyByToken("token")).id, "key-1");
  assert.equal(routeHealth["node-a"], "healthy");
  assert.equal((await repository.listDeploymentsByProjectId("project-1"))[0].id, "dep-1");
});
