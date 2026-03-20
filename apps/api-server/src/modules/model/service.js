function createModelService() {
  function buildCatalog(models = []) {
    return models.map((model) => ({
      id: model.id,
      displayName: model.displayName ?? model.id,
      provider: model.provider,
      capabilities: model.capabilities ?? [],
      visibility: model.visibility ?? "public",
    }));
  }

  return {
    buildCatalog,
  };
}

module.exports = {
  createModelService,
};
