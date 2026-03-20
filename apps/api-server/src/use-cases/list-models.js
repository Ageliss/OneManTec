function listModels({ repository, apiKeyId }) {
  const apiKeyPolicy = repository.getApiKeyPolicyByKeyId(apiKeyId);

  if (!apiKeyPolicy) {
    return {
      ok: false,
      error: "missing_api_key_policy",
    };
  }

  return {
    ok: true,
    object: "list",
    data: apiKeyPolicy.allowedModels.map((modelId) => ({
      id: modelId,
      object: "model",
      owned_by: "onemantec",
    })),
  };
}

module.exports = {
  listModels,
};
