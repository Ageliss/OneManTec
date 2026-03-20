const { planSglangDeployment } = require("./sglang-deployment.js");

if (require.main === module) {
  const example = planSglangDeployment({
    deploymentId: "demo-deployment",
    modelAlias: "deepseek-chat",
    modelPath: "/models/deepseek-chat",
    nodeId: "node-a",
  });

  process.stdout.write(`${JSON.stringify(example, null, 2)}\n`);
}

module.exports = {
  planSglangDeployment,
};
