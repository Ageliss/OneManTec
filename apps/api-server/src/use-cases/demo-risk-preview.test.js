const test = require("node:test");
const assert = require("node:assert/strict");

const { createControlPlane } = require("../control-plane.js");
const { createInMemoryRepository } = require("../repositories/in-memory-repository.js");
const { previewDemoRisk } = require("./demo-risk-preview.js");

test("demo risk preview emits a risk event for burst traffic", () => {
  const result = previewDemoRisk({
    repository: createInMemoryRepository(),
    controlPlane: createControlPlane(),
    projectId: "project-demo",
    tenantId: "tenant-demo",
    apiKeyId: "key-demo",
    requestsInCurrentMinute: 999,
    estimatedCharge: 1,
  });

  assert.equal(result.ok, true);
  assert.equal(result.detection.risky, true);
  assert.equal(result.riskEvent.riskType, "request_burst");
});
