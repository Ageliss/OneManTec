const { buildServerManifest } = require("./server-manifest.js");
const { buildModuleLayout } = require("./module-layout.js");
const { createControlPlane } = require("./control-plane.js");
const { createRepository } = require("./repositories/index.js");
const { previewDemoRequest } = require("./use-cases/demo-request-preview.js");
const { previewDemoSettlement } = require("./use-cases/demo-settlement-preview.js");
const { previewDemoRisk } = require("./use-cases/demo-risk-preview.js");
const { createMockChatCompletion } = require("./use-cases/mock-chat-completion.js");
const { resolveRuntimeContext } = require("./use-cases/runtime-context.js");
const { listModels } = require("./use-cases/list-models.js");
const { listAdminModels } = require("./use-cases/list-admin-models.js");
const { listAdminNodes } = require("./use-cases/list-admin-nodes.js");
const { resolveDeployment } = require("./use-cases/resolve-deployment.js");
const { requireFields } = require("./validation.js");
const { createErrorResponse, createSuccessResponse } = require("./errors.js");
const { getRequestId } = require("./request-context.js");

function createHttpApp(options = {}) {
  const controlPlane = createControlPlane();
  const repository = options.repository ?? createRepository(options.repositoryOptions);

  function handleRoute({ method, pathname, headers = {}, body = {} }) {
    const requestId = getRequestId(headers);

    if (method === "GET" && pathname === "/health") {
      return createSuccessResponse(200, {
        service: "api-server",
      }, requestId);
    }

    if (method === "GET" && pathname === "/manifest") {
      return createSuccessResponse(200, {
        ...buildServerManifest(),
        moduleLayout: buildModuleLayout(),
      }, requestId);
    }

    if (method === "GET" && pathname === "/modules") {
      return createSuccessResponse(200, {
        modules: buildModuleLayout(),
      }, requestId);
    }

    if (method === "GET" && pathname === "/admin/models") {
      return createSuccessResponse(
        200,
        listAdminModels({ repository, controlPlane }),
        requestId,
      );
    }

    if (method === "GET" && pathname === "/admin/nodes") {
      return createSuccessResponse(
        200,
        listAdminNodes({ repository, controlPlane }),
        requestId,
      );
    }

    if (method === "GET" && pathname === "/v1/models") {
      const runtimeContext = resolveRuntimeContext({
        repository,
        headers,
        body,
      });

      if (!runtimeContext.ok) {
        return createErrorResponse(401, runtimeContext.error, "Missing runtime authorization context", undefined, requestId);
      }

      const result = listModels({
        repository,
        apiKeyId: runtimeContext.apiKeyId,
      });

      if (!result.ok) {
        return createErrorResponse(404, result.error, "Models were not found for this API key", undefined, requestId);
      }

      return createSuccessResponse(200, result, requestId);
    }

    if (method === "POST" && pathname === "/preview/auth") {
      const validationError = requireFields(body, ["apiKeyPolicy", "model", "ipAddress"]);
      if (validationError) {
        validationError.body.requestId = requestId;
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
        requestId,
      );
    }

    if (method === "POST" && pathname === "/preview/budget") {
      const validationError = requireFields(body, ["budget", "estimatedCharge"]);
      if (validationError) {
        validationError.body.requestId = requestId;
        return validationError;
      }

      return createSuccessResponse(
        200,
        controlPlane.project.previewCharge({
          budget: body.budget,
          estimatedCharge: body.estimatedCharge ?? 0,
        }),
        requestId,
      );
    }

    if (method === "POST" && pathname === "/preview/route") {
      const validationError = requireFields(body, ["routingPolicy", "healthByTarget"]);
      if (validationError) {
        validationError.body.requestId = requestId;
        return validationError;
      }

      return createSuccessResponse(
        200,
        controlPlane.routing.previewRoute({
          routingPolicy: body.routingPolicy,
          healthByTarget: body.healthByTarget ?? {},
          tenantPinnedTarget: body.tenantPinnedTarget ?? null,
        }),
        requestId,
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
        validationError.body.requestId = requestId;
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
      }, requestId);
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
        validationError.body.requestId = requestId;
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
        requestId,
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
        validationError.body.requestId = requestId;
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
        return createErrorResponse(404, result.error, "Demo data was not found", undefined, requestId);
      }

      return createSuccessResponse(200, result, requestId);
    }

    if (method === "POST" && pathname === "/preview/deployment-resolution") {
      const validationError = requireFields(body, ["projectId", "modelAlias"]);
      if (validationError) {
        validationError.body.requestId = requestId;
        return validationError;
      }

      const result = resolveDeployment({
        repository,
        controlPlane,
        projectId: body.projectId,
        modelAlias: body.modelAlias,
      });

      if (!result.ok) {
        return createErrorResponse(404, result.error, "Deployment was not found", undefined, requestId);
      }

      return createSuccessResponse(200, result, requestId);
    }

    if (method === "POST" && pathname === "/preview/demo-settlement") {
      const validationError = requireFields(body, ["tenantId", "amount"]);
      if (validationError) {
        validationError.body.requestId = requestId;
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
        return createErrorResponse(404, result.error, "Demo settlement data was not found", undefined, requestId);
      }

      return createSuccessResponse(200, result, requestId);
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
        validationError.body.requestId = requestId;
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
        return createErrorResponse(404, result.error, "Demo risk data was not found", undefined, requestId);
      }

      return createSuccessResponse(200, result, requestId);
    }

    if (method === "POST" && pathname === "/v1/chat/completions") {
      const validationError = requireFields(body, ["model", "ipAddress", "messages"]);
      if (validationError) {
        validationError.body.requestId = requestId;
        return validationError;
      }

      const runtimeContext = resolveRuntimeContext({
        repository,
        headers,
        body,
      });

      if (!runtimeContext.ok) {
        return createErrorResponse(401, runtimeContext.error, "Missing runtime authorization context", undefined, requestId);
      }

      const result = createMockChatCompletion({
        repository,
        controlPlane,
        tenantId: runtimeContext.tenantId,
        projectId: runtimeContext.projectId,
        apiKeyId: runtimeContext.apiKeyId,
        model: body.model,
        ipAddress: body.ipAddress,
        messages: body.messages,
        requestsInCurrentMinute: body.requestsInCurrentMinute ?? 0,
      });

      if (!result.ok) {
        return createErrorResponse(403, result.reason ?? "runtime_denied", "Mock runtime request denied", {
          stage: result.stage,
        }, requestId);
      }

      return createSuccessResponse(200, result, requestId);
    }

    return createErrorResponse(404, "not_found", `No route for ${method} ${pathname}`, undefined, requestId);
  }

  return {
    handleRoute,
  };
}

module.exports = {
  createHttpApp,
};
