const test = require("node:test");
const assert = require("node:assert/strict");

const { adminPanels } = require("./page-data.js");

test("admin page data contains routing and node panels", () => {
  assert.equal(adminPanels.length, 3);
  assert.equal(adminPanels[0].id, "routing");
  assert.equal(adminPanels[1].id, "nodes");
});
