const test = require("node:test");
const assert = require("node:assert/strict");

const { createAuthService } = require("./service.js");

test("auth service evaluates runtime request using API key policy", () => {
  const service = createAuthService();
  const policy = service.createKeyPolicy({
    allowedModels: ["deepseek-chat"],
    allowedIps: ["127.0.0.1"],
  });

  const result = service.authorizeRuntimeRequest({
    apiKeyPolicy: policy,
    model: "deepseek-chat",
    ipAddress: "127.0.0.1",
    requestsInCurrentMinute: 0,
  });

  assert.equal(result.allowed, true);
  assert.equal(result.reason, "allowed");
});
