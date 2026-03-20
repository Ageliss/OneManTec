const { previewDemoRequest } = require("./demo-request-preview.js");

function createMockChatCompletion({
  repository,
  controlPlane,
  tenantId,
  projectId,
  apiKeyId,
  model,
  ipAddress,
  messages,
  requestsInCurrentMinute = 0,
}) {
  const prompt = extractLastUserMessage(messages);
  const inputTokens = estimateInputTokens(messages);
  const outputText = `Mock response for: ${prompt}`;
  const outputTokens = estimateOutputTokens(outputText);

  const preview = previewDemoRequest({
    repository,
    controlPlane,
    tenantId,
    projectId,
    apiKeyId,
    model,
    ipAddress,
    requestsInCurrentMinute,
    inputTokens,
    outputTokens,
  });

  if (!preview.ok) {
    return preview;
  }

  return {
    ok: true,
    completion: {
      id: "chatcmpl_mock_001",
      object: "chat.completion",
      created: 1_700_000_000,
      model,
      choices: [
        {
          index: 0,
          finish_reason: "stop",
          message: {
            role: "assistant",
            content: outputText,
          },
        },
      ],
      usage: {
        prompt_tokens: inputTokens,
        completion_tokens: outputTokens,
        total_tokens: inputTokens + outputTokens,
      },
    },
    preview,
  };
}

function extractLastUserMessage(messages = []) {
  const userMessages = messages.filter((message) => message.role === "user");
  return userMessages.at(-1)?.content ?? "empty prompt";
}

function estimateInputTokens(messages = []) {
  const totalCharacters = messages
    .map((message) => String(message.content ?? ""))
    .join(" ")
    .length;

  return Math.max(1, Math.ceil(totalCharacters / 4));
}

function estimateOutputTokens(text) {
  return Math.max(1, Math.ceil(String(text).length / 4));
}

module.exports = {
  createMockChatCompletion,
};
