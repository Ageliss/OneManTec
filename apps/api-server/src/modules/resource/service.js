function createResourceService() {
  function summarizeNodes(nodes = []) {
    return {
      total: nodes.length,
      healthy: nodes.filter((node) => node.health === "healthy").length,
      degraded: nodes.filter((node) => node.health === "degraded").length,
      offline: nodes.filter((node) => node.health === "offline").length,
    };
  }

  return {
    summarizeNodes,
  };
}

module.exports = {
  createResourceService,
};
