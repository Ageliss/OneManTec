const test = require("node:test");
const assert = require("node:assert/strict");

const { createRepository, buildRepository } = require("./index.js");

test("createRepository defaults to the in-memory adapter", () => {
  const repository = createRepository();

  assert.equal(typeof repository.getProjectById, "function");
  assert.equal(repository.getProjectById("project-demo").id, "project-demo");
});

test("createRepository supports explicit prisma mode with injected client", async () => {
  const prisma = {
    tenant: { findUnique: async () => ({ id: "tenant-1" }) },
    project: { findUnique: async () => ({ id: "project-1" }) },
    modelCatalog: { findMany: async () => [] },
    nodeInventory: { findMany: async () => [] },
    apiKey: {
      findUnique: async () => ({ id: "key-1" }),
      findFirst: async () => ({ id: "key-1" }),
    },
    apiKeyPolicy: { findFirst: async () => ({ id: "policy-1" }) },
    quotaPolicy: { findFirst: async () => ({ id: "quota-1" }) },
    routingRule: { findFirst: async () => ({ id: "route-1" }) },
    planPrice: { findFirst: async () => ({ id: "price-1" }) },
    riskPolicy: { findFirst: async () => ({ id: "risk-1" }) },
    deploymentRecord: { findMany: async () => [] },
  };

  const repository = createRepository({
    mode: "prisma",
    prisma,
  });

  assert.equal((await repository.getTenantById("tenant-1")).id, "tenant-1");
});

test("buildRepository rejects unsupported repository modes", () => {
  assert.throws(
    () => buildRepository("unknown", {}),
    /Unsupported repository mode/,
  );
});
