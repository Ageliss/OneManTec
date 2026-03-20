function resolveDeployment({ repository, controlPlane, projectId, modelAlias }) {
  const deployments = repository.listDeploymentsByProjectId(projectId);
  const resolution = controlPlane.deployment.resolveActiveDeployment(deployments, modelAlias);

  if (!resolution.found) {
    return {
      ok: false,
      error: "deployment_not_found",
    };
  }

  return {
    ok: true,
    deployment: resolution.deployment,
  };
}

module.exports = {
  resolveDeployment,
};
