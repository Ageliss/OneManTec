/**
 * The first backend milestone is a documented manifest rather than a framework-heavy server.
 * This keeps the structure explicit while the repository is still in early bootstrap.
 */
function buildServerManifest() {
  return {
    app: "api-server",
    purpose: "Control-plane API for OneManTec",
    modules: [
      {
        id: "auth",
        responsibility: "Login, tenant identity, API key lifecycle, role checks",
      },
      {
        id: "project",
        responsibility: "Project boundaries, environments, and budget ownership",
      },
      {
        id: "routing",
        responsibility: "Model alias routing, failover, and route target selection",
      },
      {
        id: "billing",
        responsibility: "Usage recording, pricing, ledger, and reconciliation hooks",
      },
      {
        id: "settlement",
        responsibility: "Recharge, invoices, refunds, and finance records",
      },
      {
        id: "risk-control",
        responsibility: "Abuse detection, key suspension, and risk event handling",
      },
    ],
  };
}

module.exports = {
  buildServerManifest,
};
