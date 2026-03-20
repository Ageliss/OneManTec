const test = require("node:test");
const assert = require("node:assert/strict");

const { portalSections, portalHighlights } = require("./page-data.js");

test("portal page data contains the planned key sections", () => {
  assert.equal(portalSections.length, 3);
  assert.equal(portalSections[0].id, "keys");
  assert.equal(portalHighlights.includes("OpenAI 风格 API 入口"), true);
});
