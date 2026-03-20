const test = require("node:test");
const assert = require("node:assert/strict");

const { createControlPlane } = require("../control-plane.js");
const { createInMemoryRepository } = require("../repositories/in-memory-repository.js");
const { listAdminNodes } = require("./list-admin-nodes.js");

test("listAdminNodes returns node inventory and health summary", () => {
  const result = listAdminNodes({
    repository: createInMemoryRepository(),
    controlPlane: createControlPlane(),
  });

  assert.equal(result.ok, true);
  assert.equal(result.summary.total, 2);
  assert.equal(result.nodes[0].id, "node-a");
});
