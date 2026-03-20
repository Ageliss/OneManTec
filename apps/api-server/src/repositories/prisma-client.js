function createPrismaClient(options = {}) {
  const PrismaClient = options.PrismaClient ?? loadPrismaClientClass();

  return new PrismaClient();
}

function loadPrismaClientClass() {
  try {
    const prismaModule = require("@prisma/client");
    return prismaModule.PrismaClient;
  } catch (error) {
    throw new Error(
      "Prisma repository mode requires @prisma/client. Install dependencies and generate the Prisma client before using API_SERVER_REPOSITORY_MODE=prisma.",
      { cause: error },
    );
  }
}

module.exports = {
  createPrismaClient,
  loadPrismaClientClass,
};
