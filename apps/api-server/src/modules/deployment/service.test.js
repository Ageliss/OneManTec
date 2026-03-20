const test = require("node:test");
const assert = require("node:assert/strict");

const { createDeploymentService } = require("./service.js");

test("deployment service resolves running deployment by model alias", () => {
  const service = createDeploymentService();
  const result = service.resolveActiveDeployment(
    [
      { id: "dep-1", modelAlias: "deepseek-chat", status: "running", endpoint: "http://node-a" },
    ],
    "deepseek-chat",
  );

  assert.equal(result.found, true);
  assert.equal(result.deployment.id, "dep-1");
});
