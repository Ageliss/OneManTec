function createErrorResponse(statusCode, error, message, details = undefined, requestId = null) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: {
      ok: false,
      requestId,
      error,
      message,
      details,
    },
  };
}

function createSuccessResponse(statusCode, data, requestId = null) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: {
      ok: true,
      requestId,
      data,
    },
  };
}

module.exports = {
  createErrorResponse,
  createSuccessResponse,
};
