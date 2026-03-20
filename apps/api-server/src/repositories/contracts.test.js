const test = require("node:test");
const assert = require("node:assert/strict");

const { ensureRepositoryContract } = require("./contracts.js");
const { createInMemoryRepository } = require("./in-memory-repository.js");

test("in-memory repository satisfies the current repository contract", () => {
  const result = ensureRepositoryContract(createInMemoryRepository());

  assert.equal(result.valid, true);
  assert.deepEqual(result.missing, []);
});
