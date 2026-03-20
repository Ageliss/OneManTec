function getRequestId(headers = {}) {
  return headers["x-request-id"] ?? "req_local_mock";
}

function getBearerToken(headers = {}) {
  const authorization = headers.authorization ?? headers.Authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

module.exports = {
  getRequestId,
  getBearerToken,
};
