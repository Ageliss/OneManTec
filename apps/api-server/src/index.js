const { buildServerManifest } = require("./server-manifest.js");

if (require.main === module) {
  const manifest = buildServerManifest();
  console.log(JSON.stringify(manifest, null, 2));
}

module.exports = {
  buildServerManifest,
};
