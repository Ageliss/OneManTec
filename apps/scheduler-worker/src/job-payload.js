function parsePositiveInteger(value, fallback) {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error("invalid_positive_integer");
  }

  return value;
}

function buildDeploymentJobPayload(task = {}) {
  if (!task.id) {
    throw new Error("task_id_required");
  }

  if (!task.deploymentId) {
    throw new Error("deployment_id_required");
  }

  if (!task.modelAlias) {
    throw new Error("model_alias_required");
  }

  if (!task.modelPath) {
    throw new Error("model_path_required");
  }

  const runtimeConfig = task.runtimeConfig ?? {};
  const requestedPort = parsePositiveInteger(task.requestedPort, 30000);
  const requestedGpuCount = parsePositiveInteger(task.requestedGpuCount, 1);
  const tensorParallelSize = parsePositiveInteger(task.tensorParallelSize, requestedGpuCount);

  return {
    jobType: task.taskType ?? "deploy",
    taskId: task.id,
    deploymentId: task.deploymentId,
    projectId: task.projectId ?? null,
    nodeId: task.nodeId ?? null,
    priority: task.priority ?? "normal",
    spec: {
      deploymentId: task.deploymentId,
      modelAlias: task.modelAlias,
      modelPath: task.modelPath,
      nodeId: task.nodeId ?? undefined,
      port: requestedPort,
      gpuCount: requestedGpuCount,
      tensorParallelSize,
      image: task.image ?? "lmsysorg/sglang:latest",
      extraEnv: runtimeConfig.extraEnv ?? {},
      extraArgs: runtimeConfig.extraArgs ?? [],
      volumes: runtimeConfig.volumes ?? [],
      maxRunningRequests: runtimeConfig.maxRunningRequests,
      maxTotalTokens: runtimeConfig.maxTotalTokens,
      memFractionStatic: runtimeConfig.memFractionStatic,
      trustRemoteCode: runtimeConfig.trustRemoteCode ?? false,
    },
    metadata: {
      status: task.status ?? "pending",
      createdAt: task.createdAt ?? null,
      schedulerHints: runtimeConfig.schedulerHints ?? {},
    },
  };
}

module.exports = {
  buildDeploymentJobPayload,
};
