const test = require("node:test");
const assert = require("node:assert/strict");

const { planSglangDeployment } = require("./sglang-deployment.js");

test("plans a minimal sglang deployment with defaults", () => {
  const plan = planSglangDeployment({
    deploymentId: "dep-001",
    modelAlias: "deepseek-chat",
    modelPath: "/models/deepseek-chat",
    nodeId: "node-a",
  });

  assert.equal(plan.containerName, "sglang-dep-001");
  assert.equal(plan.image, "lmsysorg/sglang:latest");
  assert.equal(plan.port, 30000);
  assert.equal(plan.gpuCount, 1);
  assert.equal(plan.tensorParallelSize, 1);
  assert.deepEqual(plan.volumes, ["/var/lib/onemantec/sglang/dep-001:/data"]);
  assert.equal(plan.environment.MODEL_ALIAS, "deepseek-chat");
  assert.equal(plan.healthCheck.readinessUrl, "http://127.0.0.1:30000/v1/models");
  assert.equal(plan.runtime.chatCompletionsUrl, "http://node-a:30000/v1/chat/completions");
  assert.match(plan.dockerCommand, /docker/);
  assert.match(plan.dockerCommand, /sglang.launch_server/);
});

test("includes optional args, env, and extra volumes in docker plan", () => {
  const plan = planSglangDeployment({
    deploymentId: "dep-002",
    modelAlias: "qwen-max",
    modelPath: "/models/qwen-max",
    gpuCount: 4,
    tensorParallelSize: 2,
    trustRemoteCode: true,
    maxRunningRequests: 64,
    maxTotalTokens: 32768,
    memFractionStatic: 0.8,
    extraEnv: {
      HF_TOKEN: "secret-token",
    },
    extraArgs: ["--schedule-policy", "fcfs"],
    volumes: [
      "/models:/models:ro",
      { hostPath: "/cache/hf", containerPath: "/root/.cache/huggingface" },
    ],
  });

  assert.equal(plan.gpuCount, 4);
  assert.equal(plan.tensorParallelSize, 2);
  assert.equal(plan.environment.HF_TOKEN, "secret-token");
  assert.deepEqual(plan.volumes, [
    "/var/lib/onemantec/sglang/dep-002:/data",
    "/models:/models:ro",
    "/cache/hf:/root/.cache/huggingface",
  ]);
  assert.deepEqual(plan.serverArgs.slice(-8), [
    "--trust-remote-code",
    "--max-running-requests",
    "64",
    "--max-total-tokens",
    "32768",
    "--mem-fraction-static",
    "0.8",
    "--schedule-policy",
    "fcfs",
  ].slice(-8));
  assert.match(plan.dockerCommand, /HF_TOKEN=secret-token/);
  assert.match(plan.dockerCommand, /--gpus/);
});

test("throws for missing required fields or invalid sizes", () => {
  assert.throws(() => {
    planSglangDeployment({
      modelAlias: "deepseek-chat",
      modelPath: "/models/deepseek-chat",
    });
  }, /deployment_id_required/);

  assert.throws(() => {
    planSglangDeployment({
      deploymentId: "dep-003",
      modelAlias: "deepseek-chat",
      modelPath: "/models/deepseek-chat",
      gpuCount: 0,
    });
  }, /invalid_gpu_count/);

  assert.throws(() => {
    planSglangDeployment({
      deploymentId: "dep-003",
      modelAlias: "deepseek-chat",
      modelPath: "/models/deepseek-chat",
      port: -1,
    });
  }, /invalid_port/);
});
