const { createInMemoryRepository } = require("./in-memory-repository.js");
const { createPrismaRepository } = require("./prisma-repository.js");
const { ensureRepositoryContract } = require("./contracts.js");
const { resolveRepositoryMode } = require("./runtime-config.js");
const { createPrismaClient } = require("./prisma-client.js");

function createRepository(options = {}) {
  const mode = resolveRepositoryMode(options.mode);
  const repository = buildRepository(mode, options);
  const contractCheck = ensureRepositoryContract(repository);

  if (!contractCheck.valid) {
    throw new Error(`Repository contract mismatch: ${contractCheck.missing.join(", ")}`);
  }

  return repository;
}

function buildRepository(mode, options) {
  if (mode === "memory") {
    return createInMemoryRepository(options.seed);
  }

  if (mode === "prisma") {
    const prismaClient = options.prisma ?? createPrismaClient(options.prismaOptions);
    return createPrismaRepository(prismaClient);
  }

  throw new Error(`Unsupported repository mode: ${mode}`);
}

module.exports = {
  createRepository,
  buildRepository,
};
