const test = require("node:test");
const assert = require("node:assert/strict");

const { createModelService } = require("./service.js");

test("model service normalizes model catalog entries", () => {
  const service = createModelService();
  const catalog = service.buildCatalog([
    {
      id: "deepseek-chat",
      provider: "onemantec",
      capabilities: ["chat", "stream"],
    },
  ]);

  assert.equal(catalog[0].id, "deepseek-chat");
  assert.deepEqual(catalog[0].capabilities, ["chat", "stream"]);
});
