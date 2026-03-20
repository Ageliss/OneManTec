const test = require("node:test");
const assert = require("node:assert/strict");

const { createApiKeyPolicy, evaluateApiKeyAccess } = require("./policy.js");

test("allows request when policy is active and model/ip are permitted", () => {
  const policy = createApiKeyPolicy({
    allowedModels: ["deepseek-chat"],
    allowedIps: ["10.0.0.2"],
    maxRequestsPerMinute: 10,
  });

  const result = evaluateApiKeyAccess({
    policy,
    model: "deepseek-chat",
    ipAddress: "10.0.0.2",
    requestsInCurrentMinute: 5,
  });

  assert.deepEqual(result, { allowed: true, reason: "allowed" });
});

test("blocks request when model is outside allow-list", () => {
  const policy = createApiKeyPolicy({ allowedModels: ["deepseek-chat"] });

  const result = evaluateApiKeyAccess({
    policy,
    model: "qwen-max",
    ipAddress: "10.0.0.2",
  });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "model_not_allowed");
});

test("blocks request when rpm limit is exceeded", () => {
  const policy = createApiKeyPolicy({ maxRequestsPerMinute: 2 });

  const result = evaluateApiKeyAccess({
    policy,
    model: "deepseek-chat",
    ipAddress: "10.0.0.2",
    requestsInCurrentMinute: 2,
  });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "rpm_limit_exceeded");
});
