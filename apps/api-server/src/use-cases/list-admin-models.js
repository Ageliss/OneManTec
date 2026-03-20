function listAdminModels({ repository, controlPlane }) {
  const catalog = controlPlane.model.buildCatalog(repository.listModels());

  return {
    ok: true,
    models: catalog,
  };
}

module.exports = {
  listAdminModels,
};
