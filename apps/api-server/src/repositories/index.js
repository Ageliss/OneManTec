const { createInMemoryRepository } = require("./in-memory-repository.js");
const { ensureRepositoryContract } = require("./contracts.js");

function createRepository() {
  const repository = createInMemoryRepository();
  const contractCheck = ensureRepositoryContract(repository);

  if (!contractCheck.valid) {
    throw new Error(`Repository contract mismatch: ${contractCheck.missing.join(", ")}`);
  }

  return repository;
}

module.exports = {
  createRepository,
};
