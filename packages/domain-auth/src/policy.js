/**
 * API key governance is intentionally modeled as a small pure function layer.
 * This keeps the validation rules testable before we wire them into a real API server.
 */
function createApiKeyPolicy(input = {}) {
  return {
    allowedModels: input.allowedModels ?? [],
    blockedIps: input.blockedIps ?? [],
    allowedIps: input.allowedIps ?? [],
    maxRequestsPerMinute: input.maxRequestsPerMinute ?? null,
    status: input.status ?? "active",
  };
}

function evaluateApiKeyAccess({ policy, model, ipAddress, requestsInCurrentMinute = 0 }) {
  if (!policy) {
    return { allowed: false, reason: "missing_policy" };
  }

  if (policy.status !== "active") {
    return { allowed: false, reason: "inactive_key" };
  }

  if (policy.blockedIps.includes(ipAddress)) {
    return { allowed: false, reason: "blocked_ip" };
  }

  if (policy.allowedIps.length > 0 && !policy.allowedIps.includes(ipAddress)) {
    return { allowed: false, reason: "ip_not_allowed" };
  }

  if (policy.allowedModels.length > 0 && !policy.allowedModels.includes(model)) {
    return { allowed: false, reason: "model_not_allowed" };
  }

  if (
    policy.maxRequestsPerMinute !== null &&
    requestsInCurrentMinute >= policy.maxRequestsPerMinute
  ) {
    return { allowed: false, reason: "rpm_limit_exceeded" };
  }

  return { allowed: true, reason: "allowed" };
}

module.exports = {
  createApiKeyPolicy,
  evaluateApiKeyAccess,
};
