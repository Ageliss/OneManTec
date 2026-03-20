const test = require("node:test");
const assert = require("node:assert/strict");

const { buildServerManifest, buildModuleLayout } = require("./index.js");

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

test("exposes module layout for each manifest module", () => {
  const layout = buildModuleLayout();

  assert.equal(layout.length, 6);
  assert.equal(layout[0].readmePath, "src/modules/auth/README.md");
});
