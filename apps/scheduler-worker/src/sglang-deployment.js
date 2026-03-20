function normalizeVolume(volume) {
  if (typeof volume === "string") {
    return volume;
  }

  if (!volume || !volume.hostPath || !volume.containerPath) {
    throw new Error("invalid_volume");
  }

  return `${volume.hostPath}:${volume.containerPath}`;
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\"'\"'`)}'`;
}

function buildDockerCommand(parts) {
  return parts.map((part) => shellQuote(part)).join(" ");
}

function planSglangDeployment(spec = {}) {
  const {
    deploymentId,
    modelAlias,
    modelPath,
    host = "0.0.0.0",
    port = 30000,
    gpuCount = 1,
    tensorParallelSize = gpuCount,
    trustRemoteCode = false,
    maxRunningRequests,
    maxTotalTokens,
    memFractionStatic,
    nodeId,
    image = "lmsysorg/sglang:latest",
    apiBasePath = "/v1",
    dataDir = `/var/lib/onemantec/sglang/${deploymentId ?? modelAlias ?? "deployment"}`,
    shmSize = "16g",
    extraEnv = {},
    extraArgs = [],
    volumes = [],
  } = spec;

  if (!deploymentId) {
    throw new Error("deployment_id_required");
  }

  if (!modelAlias) {
    throw new Error("model_alias_required");
  }

  if (!modelPath) {
    throw new Error("model_path_required");
  }

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("invalid_port");
  }

  if (!Number.isInteger(gpuCount) || gpuCount <= 0) {
    throw new Error("invalid_gpu_count");
  }

  if (!Number.isInteger(tensorParallelSize) || tensorParallelSize <= 0) {
    throw new Error("invalid_tensor_parallel_size");
  }

  const normalizedVolumes = Array.from(
    new Set([`${dataDir}:/data`, ...volumes.map(normalizeVolume)]),
  );

  const env = {
    SGLANG_HOST: host,
    SGLANG_PORT: String(port),
    MODEL_ALIAS: modelAlias,
    MODEL_PATH: modelPath,
    DEPLOYMENT_ID: deploymentId,
    ...Object.fromEntries(
      Object.entries(extraEnv).map(([key, value]) => [key, String(value)]),
    ),
  };

  const serverArgs = [
    "python3",
    "-m",
    "sglang.launch_server",
    "--host",
    host,
    "--port",
    String(port),
    "--model-path",
    modelPath,
    "--served-model-name",
    modelAlias,
    "--tp-size",
    String(tensorParallelSize),
  ];

  if (trustRemoteCode) {
    serverArgs.push("--trust-remote-code");
  }

  if (maxRunningRequests !== undefined) {
    serverArgs.push("--max-running-requests", String(maxRunningRequests));
  }

  if (maxTotalTokens !== undefined) {
    serverArgs.push("--max-total-tokens", String(maxTotalTokens));
  }

  if (memFractionStatic !== undefined) {
    serverArgs.push("--mem-fraction-static", String(memFractionStatic));
  }

  if (extraArgs.length > 0) {
    serverArgs.push(...extraArgs.map((value) => String(value)));
  }

  const containerName = `sglang-${deploymentId}`;
  const dockerArgs = [
    "docker",
    "run",
    "--detach",
    "--restart",
    "unless-stopped",
    "--name",
    containerName,
    "--shm-size",
    shmSize,
    "--gpus",
    String(gpuCount),
    "--network",
    "host",
    ...normalizedVolumes.flatMap((volume) => ["-v", volume]),
    ...Object.entries(env).flatMap(([key, value]) => ["-e", `${key}=${value}`]),
    image,
    ...serverArgs,
  ];

  const readinessUrl = `http://127.0.0.1:${port}${apiBasePath}/models`;
  const runtimeEndpoint = `http://${nodeId ?? "node-host"}:${port}${apiBasePath}/chat/completions`;

  return {
    deploymentId,
    modelAlias,
    nodeId: nodeId ?? null,
    containerName,
    image,
    dataDir,
    port,
    gpuCount,
    tensorParallelSize,
    environment: env,
    volumes: normalizedVolumes,
    serverArgs,
    dockerArgs,
    dockerCommand: buildDockerCommand(dockerArgs),
    healthCheck: {
      readinessUrl,
      successStatus: 200,
      intervalSeconds: 10,
      timeoutSeconds: 5,
      failureThreshold: 12,
    },
    runtime: {
      apiBasePath,
      modelsUrl: `http://127.0.0.1:${port}${apiBasePath}/models`,
      chatCompletionsUrl: runtimeEndpoint,
    },
  };
}

module.exports = {
  planSglangDeployment,
};
