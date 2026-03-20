function createDeploymentService() {
  function resolveActiveDeployment(deployments = [], modelAlias) {
    const active = deployments.find(
      (deployment) =>
        deployment.modelAlias === modelAlias &&
        deployment.status === "running" &&
        Boolean(deployment.endpoint),
    );

    if (!active) {
      return {
        found: false,
        deployment: null,
      };
    }

    return {
      found: true,
      deployment: active,
    };
  }

  return {
    resolveActiveDeployment,
  };
}

module.exports = {
  createDeploymentService,
};
