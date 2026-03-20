const test = require("node:test");
const assert = require("node:assert/strict");

const { createControlPlane } = require("./control-plane.js");

test("control plane exposes the first four executable module services", () => {
  const controlPlane = createControlPlane();

  assert.equal(typeof controlPlane.auth.authorizeRuntimeRequest, "function");
  assert.equal(typeof controlPlane.project.previewCharge, "function");
  assert.equal(typeof controlPlane.routing.evaluateRequest, "function");
  assert.equal(typeof controlPlane.billing.priceUsage, "function");
  assert.equal(typeof controlPlane.settlement.createRechargeOrder, "function");
  assert.equal(typeof controlPlane.riskControl.detectRisk, "function");
});
