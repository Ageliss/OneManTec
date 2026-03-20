function createPricingRule(input = {}) {
  return {
    version: input.version ?? 1,
    inputTokenPrice: input.inputTokenPrice ?? 0,
    outputTokenPrice: input.outputTokenPrice ?? 0,
    requestBasePrice: input.requestBasePrice ?? 0,
    currency: input.currency ?? "USD",
  };
}

/**
 * Billing is separated from persistence so the math can stay explicit and easy to test.
 */
function calculateUsageCharge({ pricingRule, usage }) {
  const inputCharge = roundCurrency(usage.inputTokens * pricingRule.inputTokenPrice);
  const outputCharge = roundCurrency(usage.outputTokens * pricingRule.outputTokenPrice);
  const total = roundCurrency(
    inputCharge + outputCharge + pricingRule.requestBasePrice,
  );

  return {
    version: pricingRule.version,
    currency: pricingRule.currency,
    inputCharge,
    outputCharge,
    requestBasePrice: pricingRule.requestBasePrice,
    total,
  };
}

function roundCurrency(value) {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function createLedgerEntry({ tenantId, usageEventId, charge, balanceBefore }) {
  return {
    tenantId,
    usageEventId,
    amount: -charge.total,
    currency: charge.currency,
    balanceBefore,
    balanceAfter: roundCurrency(balanceBefore - charge.total),
    pricingVersion: charge.version,
  };
}

module.exports = {
  createPricingRule,
  calculateUsageCharge,
  createLedgerEntry,
};
