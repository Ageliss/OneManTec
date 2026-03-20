const test = require("node:test");
const assert = require("node:assert/strict");

const { resolveRepositoryMode, SUPPORTED_REPOSITORY_MODES } = require("./runtime-config.js");

test("resolveRepositoryMode defaults to memory mode", () => {
  assert.equal(resolveRepositoryMode(undefined), "memory");
  assert.deepEqual(SUPPORTED_REPOSITORY_MODES, ["memory", "prisma"]);
});

test("resolveRepositoryMode normalizes supported env input", () => {
  assert.equal(resolveRepositoryMode("PRISMA"), "prisma");
});

test("resolveRepositoryMode rejects unsupported values", () => {
  assert.throws(
    () => resolveRepositoryMode("mongo"),
    /Unsupported API_SERVER_REPOSITORY_MODE/,
  );
});
