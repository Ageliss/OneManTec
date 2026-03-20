const test = require("node:test");
const assert = require("node:assert/strict");

const { renderAdminDocument } = require("./app.js");

test("admin renderer outputs console title and routing panel", () => {
  const html = renderAdminDocument();

  assert.match(html, /OneManTec 运营控制台/);
  assert.match(html, /Routing Policy/);
});
