const { buildServerManifest } = require("./server-manifest.js");
const { buildModuleLayout } = require("./module-layout.js");

if (require.main === module) {
  const manifest = buildServerManifest();
  console.log(
    JSON.stringify(
      {
        ...manifest,
        moduleLayout: buildModuleLayout(),
      },
      null,
      2,
    ),
  );
}

module.exports = {
  buildServerManifest,
  buildModuleLayout,
};
