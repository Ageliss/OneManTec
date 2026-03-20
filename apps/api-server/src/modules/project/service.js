const {
  createProjectBudget,
  evaluateBudgetUsage,
  recordBudgetSpend,
} = require("../../../../../packages/domain-customer/src/budget.js");

/**
 * Project module owns project-level budget state and exposes explicit checks
 * for previewing whether a request should be allowed before writing usage.
 */
function createProjectService() {
  function createBudget(input) {
    return createProjectBudget(input);
  }

  function previewCharge({ budget, estimatedCharge }) {
    return evaluateBudgetUsage({ budget, estimatedCharge });
  }

  function applyCharge({ budget, charge }) {
    return recordBudgetSpend({ budget, charge });
  }

  return {
    createBudget,
    previewCharge,
    applyCharge,
  };
}

module.exports = {
  createProjectService,
};
