const { buildServerManifest } = require("./server-manifest.js");
const { buildModuleLayout } = require("./module-layout.js");
const { createControlPlane } = require("./control-plane.js");
const { createInMemoryRepository } = require("./repositories/in-memory-repository.js");
const { previewDemoRequest } = require("./use-cases/demo-request-preview.js");
const { requireFields } = require("./validation.js");
const { createErrorResponse } = require("./errors.js");

function createHttpApp() {
  const controlPlane = createControlPlane();
  const repository = createInMemoryRepository();

  function handleRoute({ method, pathname, body = {} }) {
    if (method === "GET" && pathname === "/health") {
      return jsonResponse(200, {
        ok: true,
        service: "api-server",
      });
    }

    if (method === "GET" && pathname === "/manifest") {
      return jsonResponse(200, {
        ...buildServerManifest(),
        moduleLayout: buildModuleLayout(),
      });
    }

    if (method === "GET" && pathname === "/modules") {
      return jsonResponse(200, {
        modules: buildModuleLayout(),
      });
    }

    if (method === "POST" && pathname === "/preview/auth") {
      const validationError = requireFields(body, ["apiKeyPolicy", "model", "ipAddress"]);
      if (validationError) {
        return validationError;
      }

      return jsonResponse(
        200,
        controlPlane.auth.authorizeRuntimeRequest({
          apiKeyPolicy: body.apiKeyPolicy,
          model: body.model,
          ipAddress: body.ipAddress,
          requestsInCurrentMinute: body.requestsInCurrentMinute ?? 0,
        }),
      );
    }

    if (method === "POST" && pathname === "/preview/budget") {
      const validationError = requireFields(body, ["budget", "estimatedCharge"]);
      if (validationError) {
        return validationError;
      }

      return jsonResponse(
        200,
        controlPlane.project.previewCharge({
          budget: body.budget,
          estimatedCharge: body.estimatedCharge ?? 0,
        }),
      );
    }

    if (method === "POST" && pathname === "/preview/route") {
      const validationError = requireFields(body, ["routingPolicy", "healthByTarget"]);
      if (validationError) {
        return validationError;
      }

      return jsonResponse(
        200,
        controlPlane.routing.previewRoute({
          routingPolicy: body.routingPolicy,
          healthByTarget: body.healthByTarget ?? {},
          tenantPinnedTarget: body.tenantPinnedTarget ?? null,
        }),
      );
    }

    if (method === "POST" && pathname === "/preview/billing") {
      const validationError = requireFields(body, [
        "pricingRule",
        "usage",
        "tenantId",
        "usageEventId",
      ]);
      if (validationError) {
        return validationError;
      }

      const charge = controlPlane.billing.priceUsage({
        pricingRule: body.pricingRule,
        usage: body.usage,
      });

      const ledgerEntry = controlPlane.billing.buildLedgerEntry({
        tenantId: body.tenantId,
        usageEventId: body.usageEventId,
        charge,
        balanceBefore: body.balanceBefore ?? 0,
      });

      return jsonResponse(200, {
        charge,
        ledgerEntry,
      });
    }

    if (method === "POST" && pathname === "/preview/request") {
      const validationError = requireFields(body, [
        "apiKeyPolicy",
        "budget",
        "routingPolicy",
        "request",
        "healthByTarget",
      ]);
      if (validationError) {
        return validationError;
      }

      return jsonResponse(
        200,
        controlPlane.routing.evaluateRequest({
          apiKeyPolicy: body.apiKeyPolicy,
          budget: body.budget,
          routingPolicy: body.routingPolicy,
          request: body.request,
          estimatedCharge: body.estimatedCharge ?? 0,
          healthByTarget: body.healthByTarget ?? {},
          tenantPinnedTarget: body.tenantPinnedTarget ?? null,
        }),
      );
    }

    if (method === "POST" && pathname === "/preview/demo-request") {
      const validationError = requireFields(body, [
        "tenantId",
        "projectId",
        "apiKeyId",
        "model",
        "ipAddress",
      ]);
      if (validationError) {
        return validationError;
      }

      const result = previewDemoRequest({
        repository,
        controlPlane,
        tenantId: body.tenantId,
        projectId: body.projectId,
        apiKeyId: body.apiKeyId,
        model: body.model,
        ipAddress: body.ipAddress,
        requestsInCurrentMinute: body.requestsInCurrentMinute ?? 0,
        inputTokens: body.inputTokens ?? 0,
        outputTokens: body.outputTokens ?? 0,
      });

      if (!result.ok) {
        return createErrorResponse(404, result.error, "Demo data was not found");
      }

      return jsonResponse(200, result);
    }

    return createErrorResponse(404, "not_found", `No route for ${method} ${pathname}`);
  }

  return {
    handleRoute,
  };
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body,
  };
}

module.exports = {
  createHttpApp,
};
