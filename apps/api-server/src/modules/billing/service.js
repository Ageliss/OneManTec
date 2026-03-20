const {
  createPricingRule,
  calculateUsageCharge,
  createLedgerEntry,
} = require("../../../../../packages/domain-billing/src/index.js");

/**
 * Billing service wraps pricing math in API-server language so later controller
 * and repository code can stay simple.
 */
function createBillingService() {
  function createRule(input) {
    return createPricingRule(input);
  }

  function priceUsage({ pricingRule, usage }) {
    return calculateUsageCharge({ pricingRule, usage });
  }

  function buildLedgerEntry({ tenantId, usageEventId, charge, balanceBefore }) {
    return createLedgerEntry({
      tenantId,
      usageEventId,
      charge,
      balanceBefore,
    });
  }

  return {
    createRule,
    priceUsage,
    buildLedgerEntry,
  };
}

module.exports = {
  createBillingService,
};
