const test = require("node:test");
const assert = require("node:assert/strict");

const { renderPortalDocument } = require("./app.js");

test("portal renderer outputs customer portal title", () => {
  const html = renderPortalDocument();

  assert.match(html, /OneManTec API 控制台/);
  assert.match(html, /Usage & Billing/);
});
