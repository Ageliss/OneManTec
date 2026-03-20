function listAdminNodes({ repository, controlPlane }) {
  const nodes = repository.listNodes();
  const summary = controlPlane.resource.summarizeNodes(nodes);

  return {
    ok: true,
    nodes,
    summary,
  };
}

module.exports = {
  listAdminNodes,
};
