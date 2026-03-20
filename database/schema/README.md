# Database Schema Notes

当前先维护一份 [core-schema.sql](/Users/jiangguoqing/Documents/OneManTec/database/schema/core-schema.sql) 草案。

这样做的目的：

- 在真正引入 Prisma 前，先把表边界想清楚
- 把你已经确认要做的治理模块直接反映到 schema 上
- 避免后面开发到一半才发现项目、额度、结算、风控没表可落

这份 schema 目前重点覆盖：

- tenant / project / api key
- api key policy / quota policy
- routing rules / deployments
- usage / ledger
- product / plan price / settlement
- provider credentials / risk events
