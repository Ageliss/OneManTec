function createRoutingPolicy(input = {}) {
  return {
    modelAlias: input.modelAlias ?? "default",
    preferredTargets: input.preferredTargets ?? [],
  };
}

/**
 * Picks the first healthy target from the ordered candidate list.
 * The goal is to keep routing understandable before introducing weighted traffic.
 */
function resolveRoute({ policy, healthByTarget = {}, tenantPinnedTarget = null }) {
  if (tenantPinnedTarget) {
    const pinnedHealth = healthByTarget[tenantPinnedTarget];
    if (pinnedHealth === "healthy") {
      return { target: tenantPinnedTarget, reason: "tenant_pinned_target" };
    }
  }

  for (const target of policy.preferredTargets) {
    if (healthByTarget[target] === "healthy") {
      return { target, reason: "healthy_preferred_target" };
    }
  }

  return { target: null, reason: "no_healthy_target" };
}

module.exports = {
  createRoutingPolicy,
  resolveRoute,
};
