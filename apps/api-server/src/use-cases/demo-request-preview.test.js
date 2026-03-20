const test = require("node:test");
const assert = require("node:assert/strict");

const { createControlPlane } = require("../control-plane.js");
const { createInMemoryRepository } = require("../repositories/in-memory-repository.js");
const { previewDemoRequest } = require("./demo-request-preview.js");

test("demo request preview returns route and charge details from seeded data", () => {
  const result = previewDemoRequest({
    repository: createInMemoryRepository(),
    controlPlane: createControlPlane(),
    tenantId: "tenant-demo",
    projectId: "project-demo",
    apiKeyId: "key-demo",
    model: "deepseek-chat",
    ipAddress: "127.0.0.1",
    inputTokens: 100,
    outputTokens: 50,
  });

  assert.equal(result.ok, true);
  assert.equal(result.routingDecision.target, "node-a");
  assert.equal(result.charge.total, 0.21);
});
