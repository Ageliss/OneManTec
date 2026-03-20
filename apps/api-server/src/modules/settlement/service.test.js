const test = require("node:test");
const assert = require("node:assert/strict");

const { createSettlementService } = require("./service.js");

test("settlement service creates recharge, invoice, and refund drafts", () => {
  const service = createSettlementService();

  const recharge = service.createRechargeOrder({
    tenantId: "tenant-1",
    amount: 100,
  });

  const invoice = service.createInvoiceDraft({
    tenantId: "tenant-1",
    rechargeOrderId: "order-1",
  });

  const refund = service.createRefundRequest({
    tenantId: "tenant-1",
    rechargeOrderId: "order-1",
    amount: 20,
  });

  assert.equal(recharge.status, "pending");
  assert.equal(invoice.status, "draft");
  assert.equal(refund.amount, 20);
});
