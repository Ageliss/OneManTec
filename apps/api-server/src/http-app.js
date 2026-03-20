const { buildServerManifest } = require("./server-manifest.js");
const { buildModuleLayout } = require("./module-layout.js");
const { createControlPlane } = require("./control-plane.js");

function createHttpApp() {
  const controlPlane = createControlPlane();

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
      return jsonResponse(
        200,
        controlPlane.project.previewCharge({
          budget: body.budget,
          estimatedCharge: body.estimatedCharge ?? 0,
        }),
      );
    }

    if (method === "POST" && pathname === "/preview/route") {
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

    return jsonResponse(404, {
      error: "not_found",
      message: `No route for ${method} ${pathname}`,
    });
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
