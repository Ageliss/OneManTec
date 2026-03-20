const test = require("node:test");
const assert = require("node:assert/strict");

const { buildDeploymentJobPayload } = require("./job-payload.js");

test("builds scheduler payload from deployment task contract", () => {
  const payload = buildDeploymentJobPayload({
    id: "task-001",
    deploymentId: "dep-001",
    projectId: "project-demo",
    nodeId: "node-a",
    taskType: "deploy",
    status: "pending",
    modelAlias: "deepseek-chat",
    modelPath: "/models/deepseek-chat",
    image: "lmsysorg/sglang:v0.1.0",
    requestedGpuCount: 4,
    requestedPort: 31000,
    tensorParallelSize: 2,
    runtimeConfig: {
      maxRunningRequests: 128,
      maxTotalTokens: 65536,
      memFractionStatic: 0.82,
      trustRemoteCode: true,
      extraEnv: {
        HF_TOKEN: "secret-token",
      },
      extraArgs: ["--schedule-policy", "fcfs"],
      volumes: ["/models:/models:ro"],
      schedulerHints: {
        zone: "cn-east-a",
      },
    },
  });

  assert.equal(payload.taskId, "task-001");
  assert.equal(payload.spec.port, 31000);
  assert.equal(payload.spec.gpuCount, 4);
  assert.equal(payload.spec.tensorParallelSize, 2);
  assert.equal(payload.spec.image, "lmsysorg/sglang:v0.1.0");
  assert.equal(payload.spec.maxTotalTokens, 65536);
  assert.equal(payload.spec.trustRemoteCode, true);
  assert.deepEqual(payload.metadata.schedulerHints, { zone: "cn-east-a" });
});

test("fills defaults when optional deployment task fields are absent", () => {
  const payload = buildDeploymentJobPayload({
    id: "task-002",
    deploymentId: "dep-002",
    modelAlias: "qwen-chat",
    modelPath: "/models/qwen-chat",
  });

  assert.equal(payload.spec.port, 30000);
  assert.equal(payload.spec.gpuCount, 1);
  assert.equal(payload.spec.tensorParallelSize, 1);
  assert.equal(payload.spec.image, "lmsysorg/sglang:latest");
  assert.deepEqual(payload.spec.extraArgs, []);
});

test("throws for incomplete task contract or invalid sizes", () => {
  assert.throws(() => {
    buildDeploymentJobPayload({
      deploymentId: "dep-003",
      modelAlias: "deepseek-chat",
      modelPath: "/models/deepseek-chat",
    });
  }, /task_id_required/);

  assert.throws(() => {
    buildDeploymentJobPayload({
      id: "task-003",
      deploymentId: "dep-003",
      modelAlias: "deepseek-chat",
      modelPath: "/models/deepseek-chat",
      requestedGpuCount: 0,
    });
  }, /invalid_positive_integer/);
});
