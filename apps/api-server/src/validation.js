const { createErrorResponse } = require("./errors.js");

function requireFields(body, fields) {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === null);

  if (missing.length > 0) {
    return createErrorResponse(
      400,
      "validation_error",
      "Missing required fields",
      { missingFields: missing },
    );
  }

  return null;
}

module.exports = {
  requireFields,
};
