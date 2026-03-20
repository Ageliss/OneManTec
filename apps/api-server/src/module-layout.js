const { buildServerManifest } = require("./server-manifest.js");

function buildModuleLayout() {
  const manifest = buildServerManifest();

  return manifest.modules.map((moduleEntry) => ({
    id: moduleEntry.id,
    readmePath: `src/modules/${moduleEntry.id}/README.md`,
    responsibility: moduleEntry.responsibility,
  }));
}

module.exports = {
  buildModuleLayout,
};
