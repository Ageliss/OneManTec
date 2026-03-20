const test = require("node:test");
const assert = require("node:assert/strict");

const { createBillingService } = require("./service.js");

test("billing service prices usage and creates ledger effect", () => {
  const service = createBillingService();
  const rule = service.createRule({
    version: 1,
    inputTokenPrice: 0.001,
    outputTokenPrice: 0.002,
    requestBasePrice: 0.01,
  });

  const charge = service.priceUsage({
    pricingRule: rule,
    usage: {
      inputTokens: 100,
      outputTokens: 50,
    },
  });

  const ledgerEntry = service.buildLedgerEntry({
    tenantId: "tenant-1",
    usageEventId: "usage-1",
    charge,
    balanceBefore: 10,
  });

  assert.equal(charge.total, 0.21);
  assert.equal(ledgerEntry.balanceAfter, 9.79);
});
