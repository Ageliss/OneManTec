/**
 * Budget logic is kept stateless so the same rules can run in gateway checks,
 * async reconciliation jobs, and admin previews.
 */
function createProjectBudget(input = {}) {
  return {
    monthlyLimit: input.monthlyLimit ?? 0,
    softLimitRatio: input.softLimitRatio ?? 0.8,
    hardStop: input.hardStop ?? true,
    spentThisMonth: input.spentThisMonth ?? 0,
  };
}

function evaluateBudgetUsage({ budget, estimatedCharge = 0 }) {
  const nextSpend = budget.spentThisMonth + estimatedCharge;
  const softLimit = budget.monthlyLimit * budget.softLimitRatio;

  if (budget.monthlyLimit > 0 && nextSpend >= budget.monthlyLimit && budget.hardStop) {
    return {
      allowed: false,
      status: "hard_stop",
      nextSpend,
    };
  }

  if (budget.monthlyLimit > 0 && nextSpend >= softLimit) {
    return {
      allowed: true,
      status: "warning",
      nextSpend,
    };
  }

  return {
    allowed: true,
    status: "healthy",
    nextSpend,
  };
}

function recordBudgetSpend({ budget, charge }) {
  return {
    ...budget,
    spentThisMonth: budget.spentThisMonth + charge,
  };
}

module.exports = {
  createProjectBudget,
  evaluateBudgetUsage,
  recordBudgetSpend,
};
