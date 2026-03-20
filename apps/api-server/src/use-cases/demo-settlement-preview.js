function previewDemoSettlement({ repository, controlPlane, tenantId, amount, refundAmount = 0 }) {
  const tenant = repository.getTenantById(tenantId);

  if (!tenant) {
    return {
      ok: false,
      error: "missing_demo_data",
    };
  }

  const rechargeOrder = controlPlane.settlement.createRechargeOrder({
    tenantId,
    amount,
  });

  const invoiceDraft = controlPlane.settlement.createInvoiceDraft({
    tenantId,
    rechargeOrderId: "demo-order",
  });

  const refundRequest = controlPlane.settlement.createRefundRequest({
    tenantId,
    rechargeOrderId: "demo-order",
    amount: refundAmount,
  });

  return {
    ok: true,
    tenant,
    rechargeOrder,
    invoiceDraft,
    refundRequest,
  };
}

module.exports = {
  previewDemoSettlement,
};
