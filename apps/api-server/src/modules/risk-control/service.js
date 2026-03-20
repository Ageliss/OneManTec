/**
 * Risk-control starts from clear rule evaluation instead of hidden heuristics.
 * The first version only checks spend spikes and request bursts.
 */
function createRiskControlService() {
  function detectRisk({ requestsInCurrentMinute = 0, estimatedCharge = 0, riskPolicy = {} }) {
    const maxRequestsPerMinute = riskPolicy.maxRequestsPerMinute ?? 300;
    const maxSingleRequestCharge = riskPolicy.maxSingleRequestCharge ?? 50;

    if (requestsInCurrentMinute > maxRequestsPerMinute) {
      return {
        risky: true,
        riskType: "request_burst",
        severity: "high",
      };
    }

    if (estimatedCharge > maxSingleRequestCharge) {
      return {
        risky: true,
        riskType: "high_cost_request",
        severity: "medium",
      };
    }

    return {
      risky: false,
      riskType: "healthy",
      severity: "none",
    };
  }

  function createRiskEvent({ tenantId, apiKeyId, riskType, severity, payload = {} }) {
    return {
      tenantId,
      apiKeyId,
      riskType,
      severity,
      payload,
    };
  }

  return {
    detectRisk,
    createRiskEvent,
  };
}

module.exports = {
  createRiskControlService,
};
