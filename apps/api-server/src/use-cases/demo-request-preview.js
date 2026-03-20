function previewDemoRequest({
  repository,
  controlPlane,
  tenantId,
  projectId,
  apiKeyId,
  model,
  ipAddress,
  requestsInCurrentMinute = 0,
  inputTokens = 0,
  outputTokens = 0,
}) {
  const tenant = repository.getTenantById(tenantId);
  const project = repository.getProjectById(projectId);
  const apiKey = repository.getApiKeyById(apiKeyId);
  const apiKeyPolicy = repository.getApiKeyPolicyByKeyId(apiKeyId);
  const budget = repository.getQuotaPolicyByProjectId(projectId);
  const routingRule = repository.getRoutingRuleByProjectAndAlias(projectId, model);
  const pricingRule = repository.getDefaultPricingRule();

  if (!tenant || !project || !apiKey || !apiKeyPolicy || !budget || !routingRule || !pricingRule) {
    return {
      ok: false,
      error: "missing_demo_data",
    };
  }

  const routingDecision = controlPlane.routing.evaluateRequest({
    apiKeyPolicy,
    budget,
    routingPolicy: {
      modelAlias: routingRule.modelAlias,
      preferredTargets: routingRule.preferredTargets,
    },
    request: {
      model,
      ipAddress,
      requestsInCurrentMinute,
    },
    estimatedCharge: 0,
    healthByTarget: repository.getRouteHealth(),
  });

  if (!routingDecision.allowed) {
    return {
      ok: false,
      stage: routingDecision.stage,
      reason: routingDecision.reason,
    };
  }

  const charge = controlPlane.billing.priceUsage({
    pricingRule,
    usage: {
      inputTokens,
      outputTokens,
    },
  });

  const budgetDecision = controlPlane.project.previewCharge({
    budget,
    estimatedCharge: charge.total,
  });

  return {
    ok: true,
    tenant,
    project,
    apiKey: {
      id: apiKey.id,
      keyPrefix: apiKey.keyPrefix,
      status: apiKey.status,
    },
    routingDecision,
    charge,
    budgetDecision,
  };
}

module.exports = {
  previewDemoRequest,
};
