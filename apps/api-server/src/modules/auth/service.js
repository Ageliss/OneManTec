const { createApiKeyPolicy, evaluateApiKeyAccess } = require("../../../../../packages/domain-auth/src/policy.js");

/**
 * Auth module service keeps the control-plane behavior readable:
 * create a policy snapshot and evaluate whether a request can use a key.
 */
function createAuthService() {
  function createKeyPolicy(input) {
    return createApiKeyPolicy(input);
  }

  function authorizeRuntimeRequest({ apiKeyPolicy, model, ipAddress, requestsInCurrentMinute }) {
    return evaluateApiKeyAccess({
      policy: apiKeyPolicy,
      model,
      ipAddress,
      requestsInCurrentMinute,
    });
  }

  return {
    createKeyPolicy,
    authorizeRuntimeRequest,
  };
}

module.exports = {
  createAuthService,
};
