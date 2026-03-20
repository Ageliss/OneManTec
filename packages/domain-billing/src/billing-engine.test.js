const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createPricingRule,
  calculateUsageCharge,
  createLedgerEntry,
} = require("./billing-engine.js");

test("calculates token charge using versioned pricing", () => {
  const pricingRule = createPricingRule({
    version: 3,
    inputTokenPrice: 0.001,
    outputTokenPrice: 0.002,
    requestBasePrice: 0.1,
  });

  const result = calculateUsageCharge({
    pricingRule,
    usage: {
      inputTokens: 100,
      outputTokens: 50,
    },
  });

  assert.equal(result.version, 3);
  assert.equal(result.total, 0.3);
});

test("creates ledger entry with negative amount and updated balance", () => {
  const charge = {
    total: 12.5,
    currency: "USD",
    version: 2,
  };

  const entry = createLedgerEntry({
    tenantId: "tenant-1",
    usageEventId: "usage-1",
    charge,
    balanceBefore: 100,
  });

  assert.equal(entry.amount, -12.5);
  assert.equal(entry.balanceAfter, 87.5);
  assert.equal(entry.pricingVersion, 2);
});
