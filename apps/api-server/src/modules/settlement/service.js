/**
 * Settlement service focuses on simple money-flow records first.
 * It intentionally keeps recharge, invoice, and refund shapes explicit.
 */
function createSettlementService() {
  function createRechargeOrder({ tenantId, amount, currency = "USD" }) {
    return {
      tenantId,
      amount,
      currency,
      status: "pending",
    };
  }

  function createInvoiceDraft({ tenantId, rechargeOrderId, invoiceCode = null }) {
    return {
      tenantId,
      rechargeOrderId,
      invoiceCode,
      status: "draft",
    };
  }

  function createRefundRequest({ tenantId, rechargeOrderId, amount }) {
    return {
      tenantId,
      rechargeOrderId,
      amount,
      status: "pending",
    };
  }

  return {
    createRechargeOrder,
    createInvoiceDraft,
    createRefundRequest,
  };
}

module.exports = {
  createSettlementService,
};
