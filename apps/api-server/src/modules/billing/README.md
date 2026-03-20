# billing module

负责：

- usage event 接收
- pricing rule
- ledger
- billing adjustment
- reconciliation hooks

当前已落地：

- `service.js`
  封装价格规则、usage 定价、账本记录映射
- `service.test.js`
  验证费用计算和余额扣减
