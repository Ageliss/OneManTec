const test = require("node:test");
const assert = require("node:assert/strict");

const { createResourceService } = require("./service.js");

test("resource service summarizes healthy and degraded nodes", () => {
  const service = createResourceService();
  const summary = service.summarizeNodes([
    { id: "node-a", health: "healthy" },
    { id: "node-b", health: "degraded" },
    { id: "node-c", health: "offline" },
  ]);

  assert.deepEqual(summary, {
    total: 3,
    healthy: 1,
    degraded: 1,
    offline: 1,
  });
});
