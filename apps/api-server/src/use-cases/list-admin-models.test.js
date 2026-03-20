const test = require("node:test");
const assert = require("node:assert/strict");

const { createControlPlane } = require("../control-plane.js");
const { createInMemoryRepository } = require("../repositories/in-memory-repository.js");
const { listAdminModels } = require("./list-admin-models.js");

test("listAdminModels returns model catalog from repository", () => {
  const result = listAdminModels({
    repository: createInMemoryRepository(),
    controlPlane: createControlPlane(),
  });

  assert.equal(result.ok, true);
  assert.equal(result.models[0].id, "deepseek-chat");
});
