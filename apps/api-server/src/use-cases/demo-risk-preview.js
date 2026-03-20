function previewDemoRisk({
  repository,
  controlPlane,
  projectId,
  tenantId,
  apiKeyId,
  requestsInCurrentMinute = 0,
  estimatedCharge = 0,
}) {
  const project = repository.getProjectById(projectId);
  const riskPolicy = repository.getRiskPolicyByProjectId(projectId);

  if (!project || !riskPolicy) {
    return {
      ok: false,
      error: "missing_demo_data",
    };
  }

  const detection = controlPlane.riskControl.detectRisk({
    requestsInCurrentMinute,
    estimatedCharge,
    riskPolicy,
  });

  if (!detection.risky) {
    return {
      ok: true,
      detection,
      riskEvent: null,
    };
  }

  return {
    ok: true,
    detection,
    riskEvent: controlPlane.riskControl.createRiskEvent({
      tenantId,
      apiKeyId,
      riskType: detection.riskType,
      severity: detection.severity,
      payload: {
        projectId,
        requestsInCurrentMinute,
        estimatedCharge,
      },
    }),
  };
}

module.exports = {
  previewDemoRisk,
};
