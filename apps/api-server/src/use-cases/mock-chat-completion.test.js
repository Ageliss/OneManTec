const test = require("node:test");
const assert = require("node:assert/strict");

const { createControlPlane } = require("../control-plane.js");
const { createInMemoryRepository } = require("../repositories/in-memory-repository.js");
const { createMockChatCompletion } = require("./mock-chat-completion.js");

test("mock chat completion returns openai-like payload and preview data", () => {
  const result = createMockChatCompletion({
    repository: createInMemoryRepository(),
    controlPlane: createControlPlane(),
    tenantId: "tenant-demo",
    projectId: "project-demo",
    apiKeyId: "key-demo",
    model: "deepseek-chat",
    ipAddress: "127.0.0.1",
    messages: [{ role: "user", content: "hello world" }],
  });

  assert.equal(result.ok, true);
  assert.equal(result.completion.object, "chat.completion");
  assert.equal(result.completion.choices[0].message.role, "assistant");
  assert.equal(result.preview.ok, true);
});
