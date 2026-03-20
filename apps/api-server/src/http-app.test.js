const test = require("node:test");
const assert = require("node:assert/strict");

const { createHttpApp } = require("./http-app.js");

test("GET /health returns service heartbeat", () => {
  const app = createHttpApp();

  const response = app.handleRoute({
    method: "GET",
    pathname: "/health",
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.ok, true);
});

test("POST /preview/request evaluates integrated gateway decision", () => {
  const app = createHttpApp();

  const response = app.handleRoute({
    method: "POST",
    pathname: "/preview/request",
    body: {
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
      routingPolicy: {
        modelAlias: "chat-default",
        preferredTargets: ["node-a", "node-b"],
      },
      request: {
        model: "deepseek-chat",
        ipAddress: "127.0.0.1",
        requestsInCurrentMinute: 0,
      },
      estimatedCharge: 1,
      healthByTarget: {
        "node-a": "offline",
        "node-b": "healthy",
      },
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.allowed, true);
  assert.equal(response.body.target, "node-b");
});

test("POST /preview/auth returns validation error when fields are missing", () => {
  const app = createHttpApp();

  const response = app.handleRoute({
    method: "POST",
    pathname: "/preview/auth",
    body: {},
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.error, "validation_error");
  assert.deepEqual(response.body.details.missingFields, ["apiKeyPolicy", "model", "ipAddress"]);
});

test("POST /preview/demo-request loads seeded control-plane data", () => {
  const app = createHttpApp();

  const response = app.handleRoute({
    method: "POST",
    pathname: "/preview/demo-request",
    body: {
      tenantId: "tenant-demo",
      projectId: "project-demo",
      apiKeyId: "key-demo",
      model: "deepseek-chat",
      ipAddress: "127.0.0.1",
      inputTokens: 100,
      outputTokens: 50,
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.ok, true);
  assert.equal(response.body.routingDecision.target, "node-a");
});

test("POST /preview/demo-settlement creates settlement preview records", () => {
  const app = createHttpApp();

  const response = app.handleRoute({
    method: "POST",
    pathname: "/preview/demo-settlement",
    body: {
      tenantId: "tenant-demo",
      amount: 100,
      refundAmount: 15,
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.rechargeOrder.amount, 100);
  assert.equal(response.body.refundRequest.amount, 15);
});

test("POST /preview/demo-risk emits risk event for abnormal traffic", () => {
  const app = createHttpApp();

  const response = app.handleRoute({
    method: "POST",
    pathname: "/preview/demo-risk",
    body: {
      projectId: "project-demo",
      tenantId: "tenant-demo",
      apiKeyId: "key-demo",
      requestsInCurrentMinute: 999,
      estimatedCharge: 1,
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.detection.risky, true);
  assert.equal(response.body.riskEvent.riskType, "request_burst");
});

test("unknown route returns 404 payload", () => {
  const app = createHttpApp();

  const response = app.handleRoute({
    method: "GET",
    pathname: "/missing",
  });

  assert.equal(response.statusCode, 404);
  assert.equal(response.body.error, "not_found");
});
