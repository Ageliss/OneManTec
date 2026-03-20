const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createProjectBudget,
  evaluateBudgetUsage,
  recordBudgetSpend,
} = require("./budget.js");

test("marks budget as warning after crossing soft limit", () => {
  const budget = createProjectBudget({
    monthlyLimit: 100,
    softLimitRatio: 0.8,
    spentThisMonth: 79,
  });

  const result = evaluateBudgetUsage({ budget, estimatedCharge: 2 });

  assert.equal(result.allowed, true);
  assert.equal(result.status, "warning");
  assert.equal(result.nextSpend, 81);
});

test("hard stops when charge would exceed monthly limit", () => {
  const budget = createProjectBudget({
    monthlyLimit: 100,
    spentThisMonth: 95,
    hardStop: true,
  });

  const result = evaluateBudgetUsage({ budget, estimatedCharge: 6 });

  assert.equal(result.allowed, false);
  assert.equal(result.status, "hard_stop");
});

test("records spend by returning a new budget snapshot", () => {
  const budget = createProjectBudget({ monthlyLimit: 100, spentThisMonth: 10 });

  const nextBudget = recordBudgetSpend({ budget, charge: 15 });

  assert.equal(nextBudget.spentThisMonth, 25);
  assert.equal(budget.spentThisMonth, 10);
});
