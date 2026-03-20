const test = require("node:test");
const assert = require("node:assert/strict");

const { createProjectService } = require("./service.js");

test("project service warns when budget enters soft limit zone", () => {
  const service = createProjectService();
  const budget = service.createBudget({
    monthlyLimit: 200,
    softLimitRatio: 0.9,
    spentThisMonth: 179,
  });

  const result = service.previewCharge({
    budget,
    estimatedCharge: 2,
  });

  assert.equal(result.allowed, true);
  assert.equal(result.status, "warning");
});
