const test = require("node:test");
const assert = require("node:assert/strict");

const { buildServerManifest } = require("./server-manifest.js");

test("documents the core backend modules in the server manifest", () => {
  const manifest = buildServerManifest();
  const moduleIds = manifest.modules.map((moduleEntry) => moduleEntry.id);

  assert.equal(manifest.app, "api-server");
  assert.deepEqual(moduleIds, [
    "auth",
    "project",
    "routing",
    "billing",
    "settlement",
    "risk-control",
  ]);
});
