const test = require("node:test");
const assert = require("node:assert/strict");

const { createInMemoryRepository } = require("../repositories/in-memory-repository.js");
const { listModels } = require("./list-models.js");

test("listModels returns models allowed by api key policy", () => {
  const result = listModels({
    repository: createInMemoryRepository(),
    apiKeyId: "key-demo",
  });

  assert.equal(result.ok, true);
  assert.equal(result.object, "list");
  assert.equal(result.data[0].id, "deepseek-chat");
});
