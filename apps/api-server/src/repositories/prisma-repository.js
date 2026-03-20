function createPrismaRepository(prisma) {
  return {
    async getTenantById(tenantId) {
      return prisma.tenant.findUnique({ where: { id: tenantId } });
    },

    async getProjectById(projectId) {
      return prisma.project.findUnique({ where: { id: projectId } });
    },

    async listModels() {
      return prisma.modelCatalog.findMany();
    },

    async listNodes() {
      return prisma.nodeInventory.findMany();
    },

    async getApiKeyById(apiKeyId) {
      return prisma.apiKey.findUnique({ where: { id: apiKeyId } });
    },

    async getApiKeyByToken(tokenValue) {
      return prisma.apiKey.findFirst({ where: { tokenValue } });
    },

    async getApiKeyPolicyByKeyId(apiKeyId) {
      return prisma.apiKeyPolicy.findFirst({ where: { apiKeyId } });
    },

    async getQuotaPolicyByProjectId(projectId) {
      return prisma.quotaPolicy.findFirst({ where: { projectId } });
    },

    async getRoutingRuleByProjectAndAlias(projectId, modelAlias) {
      return prisma.routingRule.findFirst({
        where: {
          projectId,
          modelAlias,
          isEnabled: true,
        },
      });
    },

    async getDefaultPricingRule() {
      return prisma.planPrice.findFirst({
        orderBy: {
          pricingVersion: "desc",
        },
      });
    },

    async getRouteHealth() {
      const nodes = await prisma.nodeInventory.findMany();
      return Object.fromEntries(nodes.map((node) => [node.id, node.health]));
    },

    async getRiskPolicyByProjectId(projectId) {
      return prisma.riskPolicy.findFirst({ where: { projectId } });
    },

    async listDeploymentsByProjectId(projectId) {
      return prisma.deploymentRecord.findMany({ where: { projectId } });
    },

    async getDeploymentTaskById(taskId) {
      return prisma.deploymentTask.findUnique({ where: { id: taskId } });
    },

    async listDeploymentTaskEventsByTaskId(taskId) {
      return prisma.deploymentTaskEvent.findMany({
        where: { taskId },
        orderBy: { createdAt: "asc" },
      });
    },
  };
}

module.exports = {
  createPrismaRepository,
};
