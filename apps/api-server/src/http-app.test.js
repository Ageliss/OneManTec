const test = require("node:test");
const assert = require("node:assert/strict");

const { createHttpApp } = require("./http-app.js");

test("GET /health returns service heartbeat", () => {
  const app = createHttpApp();

  const response = app.handleRoute({
    method: "GET",
    pathname: "/health",
    headers: {
      "x-request-id": "req-1",
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.ok, true);
  assert.equal(response.body.requestId, "req-1");
  assert.equal(response.body.data.service, "api-server");
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
    headers: {
      "x-request-id": "req-2",
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.ok, true);
  assert.equal(response.body.requestId, "req-2");
  assert.equal(response.body.data.allowed, true);
  assert.equal(response.body.data.target, "node-b");
});

test("POST /preview/auth returns validation error when fields are missing", () => {
  const app = createHttpApp();

  const response = app.handleRoute({
    method: "POST",
    pathname: "/preview/auth",
    body: {},
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.ok, false);
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
  assert.equal(response.body.data.ok, true);
  assert.equal(response.body.data.routingDecision.target, "node-a");
});

test("GET /v1/models resolves allowed models from bearer token", () => {
  const app = createHttpApp();

  const response = app.handleRoute({
    method: "GET",
    pathname: "/v1/models",
    headers: {
      authorization: "Bearer omtk_demo_key",
      "x-request-id": "req-models",
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.ok, true);
  assert.equal(response.body.requestId, "req-models");
  assert.equal(response.body.data.data[0].id, "deepseek-chat");
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
  assert.equal(response.body.ok, true);
  assert.equal(response.body.data.rechargeOrder.amount, 100);
  assert.equal(response.body.data.refundRequest.amount, 15);
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
  assert.equal(response.body.ok, true);
  assert.equal(response.body.data.detection.risky, true);
  assert.equal(response.body.data.riskEvent.riskType, "request_burst");
});

test("POST /v1/chat/completions returns mock completion payload", () => {
  const app = createHttpApp();

  const response = app.handleRoute({
    method: "POST",
    pathname: "/v1/chat/completions",
    body: {
      model: "deepseek-chat",
      ipAddress: "127.0.0.1",
      messages: [{ role: "user", content: "hello there" }],
    },
    headers: {
      authorization: "Bearer omtk_demo_key",
      "x-request-id": "req-chat-1",
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.ok, true);
  assert.equal(response.body.requestId, "req-chat-1");
  assert.equal(response.body.data.completion.object, "chat.completion");
  assert.equal(response.body.data.preview.routingDecision.target, "node-a");
});

test("unknown route returns 404 payload", () => {
  const app = createHttpApp();

  const response = app.handleRoute({
    method: "GET",
    pathname: "/missing",
  });

  assert.equal(response.statusCode, 404);
  assert.equal(response.body.ok, false);
  assert.equal(response.body.error, "not_found");
});
