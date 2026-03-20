const { buildServerManifest } = require("./server-manifest.js");
const { buildModuleLayout } = require("./module-layout.js");
const { createControlPlane } = require("./control-plane.js");

if (require.main === module) {
  const manifest = buildServerManifest();
  console.log(
    JSON.stringify(
      {
        ...manifest,
        moduleLayout: buildModuleLayout(),
        executableModules: Object.keys(createControlPlane()),
      },
      null,
      2,
    ),
  );
}

module.exports = {
  buildServerManifest,
  buildModuleLayout,
  createControlPlane,
};
