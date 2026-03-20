const { buildServerManifest } = require("./server-manifest.js");
const { buildModuleLayout } = require("./module-layout.js");
const { createControlPlane } = require("./control-plane.js");
const { createRepository } = require("./repositories/index.js");
const { previewDemoRequest } = require("./use-cases/demo-request-preview.js");
const { previewDemoSettlement } = require("./use-cases/demo-settlement-preview.js");
const { previewDemoRisk } = require("./use-cases/demo-risk-preview.js");
const { createMockChatCompletion } = require("./use-cases/mock-chat-completion.js");
const { requireFields } = require("./validation.js");
const { createErrorResponse, createSuccessResponse } = require("./errors.js");

function createHttpApp() {
  const controlPlane = createControlPlane();
  const repository = createRepository();

  function handleRoute({ method, pathname, body = {} }) {
    if (method === "GET" && pathname === "/health") {
      return createSuccessResponse(200, {
        service: "api-server",
      });
    }

    if (method === "GET" && pathname === "/manifest") {
      return createSuccessResponse(200, {
        ...buildServerManifest(),
        moduleLayout: buildModuleLayout(),
      });
    }

    if (method === "GET" && pathname === "/modules") {
      return createSuccessResponse(200, {
        modules: buildModuleLayout(),
      });
    }

    if (method === "POST" && pathname === "/preview/auth") {
      const validationError = requireFields(body, ["apiKeyPolicy", "model", "ipAddress"]);
      if (validationError) {
        return validationError;
      }

      return createSuccessResponse(
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

      return createSuccessResponse(
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

      return createSuccessResponse(
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

      return createSuccessResponse(200, {
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

      return createSuccessResponse(
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

      return createSuccessResponse(200, result);
    }

    if (method === "POST" && pathname === "/preview/demo-settlement") {
      const validationError = requireFields(body, ["tenantId", "amount"]);
      if (validationError) {
        return validationError;
      }

      const result = previewDemoSettlement({
        repository,
        controlPlane,
        tenantId: body.tenantId,
        amount: body.amount,
        refundAmount: body.refundAmount ?? 0,
      });

      if (!result.ok) {
        return createErrorResponse(404, result.error, "Demo settlement data was not found");
      }

      return createSuccessResponse(200, result);
    }

    if (method === "POST" && pathname === "/preview/demo-risk") {
      const validationError = requireFields(body, [
        "projectId",
        "tenantId",
        "apiKeyId",
        "requestsInCurrentMinute",
        "estimatedCharge",
      ]);
      if (validationError) {
        return validationError;
      }

      const result = previewDemoRisk({
        repository,
        controlPlane,
        projectId: body.projectId,
        tenantId: body.tenantId,
        apiKeyId: body.apiKeyId,
        requestsInCurrentMinute: body.requestsInCurrentMinute,
        estimatedCharge: body.estimatedCharge,
      });

      if (!result.ok) {
        return createErrorResponse(404, result.error, "Demo risk data was not found");
      }

      return createSuccessResponse(200, result);
    }

    if (method === "POST" && pathname === "/v1/chat/completions") {
      const validationError = requireFields(body, [
        "tenantId",
        "projectId",
        "apiKeyId",
        "model",
        "ipAddress",
        "messages",
      ]);
      if (validationError) {
        return validationError;
      }

      const result = createMockChatCompletion({
        repository,
        controlPlane,
        tenantId: body.tenantId,
        projectId: body.projectId,
        apiKeyId: body.apiKeyId,
        model: body.model,
        ipAddress: body.ipAddress,
        messages: body.messages,
        requestsInCurrentMinute: body.requestsInCurrentMinute ?? 0,
      });

      if (!result.ok) {
        return createErrorResponse(403, result.reason ?? "runtime_denied", "Mock runtime request denied", {
          stage: result.stage,
        });
      }

      return createSuccessResponse(200, result);
    }

    return createErrorResponse(404, "not_found", `No route for ${method} ${pathname}`);
  }

  return {
    handleRoute,
  };
}

module.exports = {
  createHttpApp,
};
