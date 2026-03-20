const { buildServerManifest } = require("./server-manifest.js");
const { buildModuleLayout } = require("./module-layout.js");
const { createControlPlane } = require("./control-plane.js");
const { createHttpServer } = require("./http-server.js");

if (require.main === module) {
  const port = Number(process.env.PORT ?? 3000);
  const server = createHttpServer();

  server.listen(port, () => {
    const manifest = buildServerManifest();
    console.log(
      JSON.stringify(
        {
          ...manifest,
          moduleLayout: buildModuleLayout(),
          executableModules: Object.keys(createControlPlane()),
          listeningOn: port,
        },
        null,
        2,
      ),
    );
  });
}

module.exports = {
  buildServerManifest,
  buildModuleLayout,
  createControlPlane,
  createHttpServer,
};
