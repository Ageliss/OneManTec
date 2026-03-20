const { createRoutingPolicy, resolveRoute } = require("./routing-policy.js");
const { evaluateGatewayRequest } = require("./request-guard.js");

module.exports = {
  createRoutingPolicy,
  resolveRoute,
  evaluateGatewayRequest,
};
