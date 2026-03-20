const test = require("node:test");
const assert = require("node:assert/strict");

const { createRiskControlService } = require("./service.js");

test("risk-control service flags abnormal request bursts", () => {
  const service = createRiskControlService();

  const result = service.detectRisk({
    requestsInCurrentMinute: 500,
    estimatedCharge: 1,
    riskPolicy: {
      maxRequestsPerMinute: 300,
      maxSingleRequestCharge: 50,
    },
  });

  assert.equal(result.risky, true);
  assert.equal(result.riskType, "request_burst");
});
