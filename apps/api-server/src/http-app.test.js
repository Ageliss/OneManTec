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

test("unknown route returns 404 payload", () => {
  const app = createHttpApp();

  const response = app.handleRoute({
    method: "GET",
    pathname: "/missing",
  });

  assert.equal(response.statusCode, 404);
  assert.equal(response.body.error, "not_found");
});
