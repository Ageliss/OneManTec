const test = require("node:test");
const assert = require("node:assert/strict");

const { createRoutingPolicy, resolveRoute } = require("./routing-policy.js");
const { evaluateGatewayRequest } = require("./request-guard.js");

test("uses tenant pinned target when it is healthy", () => {
  const policy = createRoutingPolicy({ preferredTargets: ["node-a", "node-b"] });

  const result = resolveRoute({
    policy,
    healthByTarget: {
      "node-a": "healthy",
      "node-b": "healthy",
      "node-c": "healthy",
    },
    tenantPinnedTarget: "node-c",
  });

  assert.deepEqual(result, {
    target: "node-c",
    reason: "tenant_pinned_target",
  });
});

test("falls back to the first healthy preferred target", () => {
  const policy = createRoutingPolicy({ preferredTargets: ["node-a", "node-b"] });

  const result = resolveRoute({
    policy,
    healthByTarget: {
      "node-a": "degraded",
      "node-b": "healthy",
    },
  });

  assert.deepEqual(result, {
    target: "node-b",
    reason: "healthy_preferred_target",
  });
});

test("blocks request when no healthy route exists", () => {
  const policy = createRoutingPolicy({ preferredTargets: ["node-a"] });

  const result = evaluateGatewayRequest({
    apiKeyPolicy: {
      status: "active",
      allowedModels: ["deepseek-chat"],
      blockedIps: [],
      allowedIps: [],
      maxRequestsPerMinute: null,
    },
    budget: {
      monthlyLimit: 100,
      softLimitRatio: 0.8,
      hardStop: true,
      spentThisMonth: 10,
    },
    routingPolicy: policy,
    request: {
      model: "deepseek-chat",
      ipAddress: "10.0.0.1",
      requestsInCurrentMinute: 0,
    },
    estimatedCharge: 1,
    healthByTarget: {
      "node-a": "offline",
    },
  });

  assert.equal(result.allowed, false);
  assert.equal(result.stage, "routing");
});
