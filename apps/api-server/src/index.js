const { buildServerManifest } = require("./server-manifest.js");
const { buildModuleLayout } = require("./module-layout.js");
const { createControlPlane } = require("./control-plane.js");
const { createHttpServer } = require("./http-server.js");
const { resolveRepositoryMode } = require("./repositories/runtime-config.js");

if (require.main === module) {
  const port = Number(process.env.PORT ?? 3000);
  const repositoryMode = resolveRepositoryMode();
  const server = createHttpServer({
    repositoryOptions: {
      mode: repositoryMode,
    },
  });

  server.listen(port, () => {
    const manifest = buildServerManifest();
    console.log(
      JSON.stringify(
        {
          ...manifest,
          moduleLayout: buildModuleLayout(),
          executableModules: Object.keys(createControlPlane()),
          repositoryMode,
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
