# 工程约定

## 1. 总体原则

- 先保证结构清楚，再追求功能堆叠
- 先保证主链路闭环，再追求高级特性
- 先保证可维护，再追求局部“聪明设计”

## 2. 仓库约定

- 使用 `pnpm workspace` 管理多应用与共享包
- `apps/` 放可运行应用
- `packages/` 放共享模块和领域代码
- `database/` 放 schema、migration、seed
- `docs/` 放产品、架构、运维文档

## 3. 命名约定

- 目录名使用 kebab-case
- TypeScript 文件优先使用 kebab-case
- 类名使用 PascalCase
- 变量名、函数名使用 camelCase

## 4. 分层约定

以后写后端时，至少保持以下层次：

- route/controller：接收请求、做入参校验
- application service：编排业务流程
- domain：承载核心业务规则
- repository：负责数据库读写

不要把控制器、业务逻辑、数据库访问全部写在一个文件里。

## 5. 运行时 API 与控制台 API

- 控制台 API：给 `web-portal` 和 `web-admin` 使用
- 运行时 API：给客户真正发起推理请求使用

这两类 API 后续要分开鉴权、分开限流、分开日志。

## 6. 优先级约定

当前优先级从高到低：

1. auth / tenant / api key
2. model / node / deployment
3. gateway / metering / billing
4. observability / alert / audit

## 7. 注释约定

- 复杂逻辑允许加中文注释
- 注释只解释“为什么这样做”或“这里有什么坑”
- 不要写无意义注释，例如“给变量赋值”

## 8. 当前下一步

接下来应优先完成：

1. 初始化各 app 的 package 和 tsconfig
2. 初始化数据库 schema
3. 初始化后端模块骨架
