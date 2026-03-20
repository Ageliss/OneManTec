const { getBearerToken } = require("../request-context.js");

function resolveRuntimeContext({ repository, headers = {}, body = {} }) {
  const token = getBearerToken(headers);
  const apiKey = token ? repository.getApiKeyByToken(token) : null;

  const tenantId = body.tenantId ?? apiKey?.tenantId ?? null;
  const projectId = body.projectId ?? apiKey?.projectId ?? null;
  const apiKeyId = body.apiKeyId ?? apiKey?.id ?? null;

  if (!tenantId || !projectId || !apiKeyId) {
    return {
      ok: false,
      error: "missing_runtime_context",
    };
  }

  return {
    ok: true,
    tenantId,
    projectId,
    apiKeyId,
  };
}

module.exports = {
  resolveRuntimeContext,
};
