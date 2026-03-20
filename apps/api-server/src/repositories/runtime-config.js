const SUPPORTED_REPOSITORY_MODES = ["memory", "prisma"];

function resolveRepositoryMode(inputMode = process.env.API_SERVER_REPOSITORY_MODE) {
  const normalizedMode = String(inputMode ?? "memory").trim().toLowerCase();

  if (!SUPPORTED_REPOSITORY_MODES.includes(normalizedMode)) {
    throw new Error(
      `Unsupported API_SERVER_REPOSITORY_MODE: ${normalizedMode}. Expected one of ${SUPPORTED_REPOSITORY_MODES.join(", ")}`,
    );
  }

  return normalizedMode;
}

module.exports = {
  SUPPORTED_REPOSITORY_MODES,
  resolveRepositoryMode,
};
