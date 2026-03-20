const { buildDeploymentJobPayload } = require("./job-payload.js");
const { planSglangDeployment } = require("./sglang-deployment.js");

if (require.main === module) {
  const payload = buildDeploymentJobPayload({
    id: "task-demo",
    deploymentId: "demo-deployment",
    modelAlias: "deepseek-chat",
    modelPath: "/models/deepseek-chat",
    nodeId: "node-a",
  });

  const plan = planSglangDeployment(payload.spec);
  process.stdout.write(`${JSON.stringify({ payload, plan }, null, 2)}\n`);
}

module.exports = {
  buildDeploymentJobPayload,
  planSglangDeployment,
};
