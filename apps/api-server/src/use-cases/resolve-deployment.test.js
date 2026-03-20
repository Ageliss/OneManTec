const test = require("node:test");
const assert = require("node:assert/strict");

const { createControlPlane } = require("../control-plane.js");
const { createInMemoryRepository } = require("../repositories/in-memory-repository.js");
const { resolveDeployment } = require("./resolve-deployment.js");

test("resolveDeployment returns active deployment for project and model alias", () => {
  const result = resolveDeployment({
    repository: createInMemoryRepository(),
    controlPlane: createControlPlane(),
    projectId: "project-demo",
    modelAlias: "deepseek-chat",
  });

  assert.equal(result.ok, true);
  assert.equal(result.deployment.targetNode, "node-a");
});
