# project module

负责：

- project / environment 管理
- project 与 tenant 关系
- project 预算归属
- project 级访问边界

当前已落地：

- `service.js`
  封装项目预算创建、预估校验和费用落账后的快照更新
- `service.test.js`
  验证 soft limit 场景
