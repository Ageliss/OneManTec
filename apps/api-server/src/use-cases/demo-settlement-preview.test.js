const test = require("node:test");
const assert = require("node:assert/strict");

const { createControlPlane } = require("../control-plane.js");
const { createInMemoryRepository } = require("../repositories/in-memory-repository.js");
const { previewDemoSettlement } = require("./demo-settlement-preview.js");

test("demo settlement preview returns recharge and invoice drafts", () => {
  const result = previewDemoSettlement({
    repository: createInMemoryRepository(),
    controlPlane: createControlPlane(),
    tenantId: "tenant-demo",
    amount: 100,
    refundAmount: 10,
  });

  assert.equal(result.ok, true);
  assert.equal(result.rechargeOrder.amount, 100);
  assert.equal(result.invoiceDraft.status, "draft");
  assert.equal(result.refundRequest.amount, 10);
});
