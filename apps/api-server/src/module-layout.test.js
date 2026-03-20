const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { buildModuleLayout } = require("./module-layout.js");

test("module layout points to existing README files for each backend module", () => {
  const moduleLayout = buildModuleLayout();

  for (const entry of moduleLayout) {
    const absolutePath = path.join(__dirname, entry.readmePath.replace(/^src\//, ""));
    const normalizedPath = path.join(__dirname, "..", entry.readmePath);

    assert.ok(fs.existsSync(normalizedPath), `missing module README for ${entry.id}`);
    assert.ok(absolutePath.length > 0);
  }
});
