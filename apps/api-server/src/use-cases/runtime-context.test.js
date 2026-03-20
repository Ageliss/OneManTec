const test = require("node:test");
const assert = require("node:assert/strict");

const { createInMemoryRepository } = require("../repositories/in-memory-repository.js");
const { resolveRuntimeContext } = require("./runtime-context.js");

test("runtime context resolves tenant, project, and api key from bearer token", () => {
  const result = resolveRuntimeContext({
    repository: createInMemoryRepository(),
    headers: {
      authorization: "Bearer omtk_demo_key",
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.tenantId, "tenant-demo");
  assert.equal(result.projectId, "project-demo");
  assert.equal(result.apiKeyId, "key-demo");
});
