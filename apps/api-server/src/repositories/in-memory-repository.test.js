const test = require("node:test");
const assert = require("node:assert/strict");

const { createInMemoryRepository } = require("./in-memory-repository.js");

test("in-memory repository returns seeded project and policy data", () => {
  const repository = createInMemoryRepository();

  assert.equal(repository.getProjectById("project-demo").name, "Demo Project");
  assert.equal(repository.getApiKeyPolicyByKeyId("key-demo").maxRequestsPerMinute, 120);
  assert.equal(repository.getDefaultPricingRule().currency, "USD");
  assert.equal(repository.getRiskPolicyByProjectId("project-demo").maxRequestsPerMinute, 300);
  assert.equal(repository.getApiKeyByToken("omtk_demo_key").id, "key-demo");
});
