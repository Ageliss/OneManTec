function createErrorResponse(statusCode, error, message, details = undefined) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: {
      ok: false,
      error,
      message,
      details,
    },
  };
}

function createSuccessResponse(statusCode, data) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: {
      ok: true,
      data,
    },
  };
}

module.exports = {
  createErrorResponse,
  createSuccessResponse,
};
