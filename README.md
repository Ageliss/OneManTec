# OneManTec

一人公司版 AI 推理平台骨架，目标覆盖以下能力：

- 面向客户的 Token / API 交付页面
- 面向运营的资源调度与部署后台
- 下游机器上的 SGLang 推理服务部署
- API 调用计量与计费

## 仓库结构

```text
apps/
  web-portal/         # 用户侧前端，给客户使用
  web-admin/          # 管理后台，给运营/管理员使用
  api-server/         # 主后端服务，承载控制台 API 与核心业务
  scheduler-worker/   # 调度任务执行器，处理部署/重试/资源分配
  metering-worker/    # 计量任务执行器，处理 usage 聚合与账单生成
  gateway/            # 运行时网关，负责鉴权、限流、转发

packages/
  ui/                 # 公共 UI 组件
  config/             # 共享工程配置，如 tsconfig、eslint 等
  shared/             # 通用类型、常量、工具函数
  domain-auth/        # 鉴权与权限域
  domain-customer/    # 用户、租户、套餐等客户域
  domain-model/       # 模型与版本管理域
  domain-resource/    # 机器资源与调度域
  domain-billing/     # 计量、计费、账本域
  domain-gateway/     # 网关与流量治理域

database/
  schema/             # 数据库 schema 草案
  migrations/         # 数据库迁移文件
  seeds/              # 初始化数据

docs/
  architecture/       # 架构设计文档
  product/            # 产品与阶段计划文档
  api/                # API 文档
  runbooks/           # 运维手册、故障处理说明

infra/
  docker/             # Docker 相关文件
  scripts/            # 部署与运维脚本
  nginx/              # 网关或反向代理配置
```

## 推荐技术栈

- 前端：Next.js + TypeScript
- 后端：NestJS + TypeScript
- 数据库：PostgreSQL
- 缓存/队列：Redis + BullMQ
- ORM：Prisma
- 推理部署：基于 Docker 的 SGLang 部署

这套组合的主要原因：

- 对一人公司足够快，能尽快上线
- 模块边界清晰，后续扩展不容易失控
- 文档、生态、招聘和交接成本都相对可控

## 核心文档

- 架构总览 / Architecture Overview: [platform-overview.md](docs/architecture/platform-overview.md)
- MVP 路线图 / MVP Roadmap: [mvp-roadmap.md](docs/product/mvp-roadmap.md)
- 初版开发计划 / Initial Plan: [initial-plan.md](docs/product/initial-plan.md)

## 当前建议的推进顺序

1. 初始化 monorepo 工程能力
2. 设计数据库 schema
3. 搭建 `api-server` 基础骨架
4. 搭建 `web-portal` 和 `web-admin` 基础骨架
5. 实现鉴权、租户、API Key 模块
6. 实现机器注册、部署任务、调度逻辑
7. 实现网关、计量与账单链路

## 当前状态

目前仓库已完成：

- 基础目录骨架
- 架构文档
- MVP 路线图
- 初版开发计划

目前还未完成：

- 工程初始化
- 业务代码
- 数据库 schema
- 更多可运行应用代码
