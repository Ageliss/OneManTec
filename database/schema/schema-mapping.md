# Schema Mapping

这份文档说明两份 schema 文件的分工：

- [core-schema.sql](/Users/jiangguoqing/Documents/OneManTec/database/schema/core-schema.sql)
  用来快速表达核心表结构，方便人直接阅读和讨论。
- [schema.prisma](/Users/jiangguoqing/Documents/OneManTec/database/schema/schema.prisma)
  用来作为后续正式 ORM 接入的起点。

当前维护两份文件的原因：

- SQL 更适合快速讨论字段和关系
- Prisma 更适合后续生成 client 和 migration

短期策略：

1. 继续以 `core-schema.sql` 作为结构讨论稿
2. 以 `schema.prisma` 作为真正代码接入的下一步基线
3. 等后端真正接 Prisma 后，再统一切到 migration-first 流程
