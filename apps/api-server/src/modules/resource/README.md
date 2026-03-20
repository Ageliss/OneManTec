# resource module

负责：

- node inventory
- health snapshots
- capacity overview
- scheduling input summaries

当前已落地：

- `service.js`
  封装节点列表和可用容量汇总
- `service.test.js`
  验证节点健康汇总
