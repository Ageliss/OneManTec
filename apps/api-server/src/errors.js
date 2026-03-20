function createErrorResponse(statusCode, error, message, details = undefined) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: {
      error,
      message,
      details,
    },
  };
}

module.exports = {
  createErrorResponse,
};
