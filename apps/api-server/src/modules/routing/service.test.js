const test = require("node:test");
const assert = require("node:assert/strict");

const { createRoutingService } = require("./service.js");

test("routing service resolves the first healthy preferred target", () => {
  const service = createRoutingService();
  const policy = service.createPolicy({
    modelAlias: "chat-default",
    preferredTargets: ["node-a", "node-b"],
  });

  const result = service.previewRoute({
    routingPolicy: policy,
    healthByTarget: {
      "node-a": "offline",
      "node-b": "healthy",
    },
  });

  assert.equal(result.target, "node-b");
});
