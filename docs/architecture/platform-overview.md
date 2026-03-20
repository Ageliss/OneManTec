# Platform Overview / 架构总览

## 1. Product Goal / 产品目标

English:
Build a compact but production-oriented platform for customer-facing API delivery, internal scheduling, downstream SGLang deployment, and usage billing.

中文注解：
目标不是只做几个页面，而是做一个可上线、可计费、可调度的完整平台，覆盖客户调用、机器部署和费用结算三条主线。

English:
The platform should stay maintainable for a solo founder, so the design must favor clear boundaries, low coupling, incremental delivery, and operational visibility.

中文注解：
因为你是一人公司，架构必须优先考虑“清楚、可拆、能逐步上线、出问题能定位”，而不是一开始追求复杂分布式设计。

## 2. Product Split / 产品拆分

English:
The system should be treated as one platform with multiple surfaces, not just two web pages.

中文注解：
这个系统本质上是“一个平台，多个界面和多个后台服务”，不能只按“前台页面 + 后台页面”来理解。

### 2.1 Customer Portal / 用户侧门户

English:
Used by external customers for sign in, API key management, model browsing, usage viewing, billing review, and API documentation.

中文注解：
这是给客户用的控制台，至少要覆盖登录、API Key、模型列表、用量、账单和文档。

### 2.2 Admin Console / 管理后台

English:
Used by the operator for user management, price management, model management, machine pool management, deployment tasks, billing review, and audit.

中文注解：
这是你自己运营平台的后台，核心是管理用户、机器、模型、部署任务和价格配置。

### 2.3 Runtime Services / 运行时服务

English:
Backend services are required for auth, gateway, deployment orchestration, resource scheduling, metering, billing, and observability.

中文注解：
真正复杂的部分不在页面，而在后面的运行时服务，包括网关、调度、部署、计费和观测。

## 3. Domain Modules / 领域模块

### 3.1 Identity and Access / 身份与权限

English:
This domain covers users, tenants, roles, API keys, sessions, and audit logs.

中文注解：
这是所有业务的入口层，后面无论是控制台访问还是运行时请求，都依赖这一层。

### 3.2 Customer and Product / 客户与商业域

English:
This domain covers customer profile, plans, balance, quota policy, and model entitlement.

中文注解：
这里定义客户买了什么、有什么额度、能用哪些模型，是商业化的核心。

### 3.3 Model and Deployment / 模型与部署域

English:
This domain covers model registry, model version, runtime template, deployment spec, and deployment instance.

中文注解：
模型不是一个简单名字，还要区分版本、镜像、启动参数、部署模板和实例状态。

### 3.4 Resource Scheduling / 资源调度域

English:
This domain covers node registration, capability reporting, GPU allocation, scheduling queue, resource locking, and retries.

中文注解：
这是平台最容易被低估的部分。没有资源锁、重试和状态管理，部署很快会乱掉。

### 3.5 API Gateway and Traffic / 网关与流量域

English:
This domain covers request authentication, rate limit, routing, tracing, and request logs.

中文注解：
所有客户请求都应该先经过网关，先鉴权、再限流、再路由、最后记录日志和 usage。

### 3.6 Metering and Billing / 计量与计费域

English:
This domain covers usage events, token counting, pricing rules, cost calculation, statements, and reconciliation.

中文注解：
计费不能直接从页面统计，它必须基于原始 usage event 派生，才能做到可复算和可对账。

### 3.7 Operations and Observability / 运维与观测域

English:
This domain covers logs, metrics, alerts, and task history.

中文注解：
没有这一层，后面定位部署失败、网关错误、计费异常会非常痛苦。

## 4. Critical Workflows / 核心流程

### 4.1 Customer API Call Flow / 客户调用链路

English:
The customer request goes through API key validation, quota and balance checks, deployment routing, SGLang forwarding, usage recording, and billing generation.

中文注解：
一条完整链路应该是：用户发请求 -> 网关校验 -> 找到目标部署 -> 转发到 SGLang -> 记录 usage -> 生成账单。

### 4.2 Deployment Flow / 部署链路

English:
The admin creates a deployment task, the orchestrator validates the spec, the scheduler selects a node, the worker deploys SGLang, and health checks confirm readiness.

中文注解：
部署不是“点一下按钮就完成”，而是任务流转、资源选择、执行部署、健康检查、失败回收这一整套流程。

### 4.3 Billing Flow / 计费链路

English:
Usage events are aggregated, transformed into billing records, and then written into the balance ledger.

中文注解：
计费一定要拆成“原始事件 -> 聚合统计 -> 账单计算 -> 账本入账”，不要一步写死。

## 5. Suggested Architecture / 推荐架构

English:
Start with a modular monorepo and a single main backend service, then split services only when the load or team size requires it.

中文注解：
先模块化，后服务化。对你现在的阶段，不要过早拆微服务，否则维护成本会高于收益。

### 5.1 Phase 1 Architecture / 第一阶段架构

English:
Start with one customer frontend, one admin frontend, one backend API service, one scheduler worker, one metering worker, PostgreSQL, and Redis.

中文注解：
这已经足够支持 MVP，并且结构上还能继续扩展。

### 5.2 Phase 2 Evolution / 第二阶段演进

English:
When necessary, split out standalone gateway, billing service, and deployment service.

中文注解：
只有当流量、职责或稳定性要求明显上升时，再拆独立服务。

## 6. Recommended Tech Stack / 推荐技术栈

### 6.1 Frontend / 前端

English:
Use Next.js and TypeScript, plus Tailwind CSS and a small internal UI package.

中文注解：
对一人公司来说，这个组合足够快，也方便同时支撑门户、后台和文档页面。

### 6.2 Backend / 后端

English:
Use Node.js with NestJS or Fastify, and Prisma for database access.

中文注解：
这里更推荐 NestJS，因为你当前更需要模块结构清楚，而不是极限性能。

### 6.3 Infrastructure / 基础设施

English:
Use PostgreSQL for relational data, Redis for cache and queues, and BullMQ for background jobs.

中文注解：
这是相对稳妥的基础组合，适合调度任务、usage 聚合和计费异步处理。

### 6.4 Deployment Target / 部署目标

English:
For MVP, start with VM plus Docker deployment for SGLang, and avoid Kubernetes too early.

中文注解：
先用虚拟机或裸机加 Docker，把部署链路跑通。Kubernetes 放到后面再说。

## 7. Repository Layout / 仓库布局

English:
Use a monorepo with `apps`, `packages`, `database`, `docs`, and `infra`.

中文注解：
这能保证前后端、共享模块、数据库和运维资料各归各位，不容易写成一锅粥。

## 8. Backend Boundaries / 后端边界

English:
Even inside one backend service, keep auth, customer, model, deployment, resource, gateway, billing, and ops modules separated.

中文注解：
哪怕先写在同一个 `api-server` 里，也要按领域模块分目录和分层，不要全塞到一个 service。

## 9. Core Data Model / 核心数据模型

English:
The initial data model should include users, tenants, api_keys, models, model_versions, nodes, deployments, deployment_tasks, usage_events, and ledger_entries.

中文注解：
这些表基本就是平台最小闭环所需的主干数据。

## 10. API Surface / API 范围

English:
Separate customer console APIs, admin APIs, and runtime inference APIs.

中文注解：
控制台接口和运行时接口不能混着设计，因为它们的鉴权、限流和日志需求完全不同。

## 11. Scheduling Considerations / 调度注意点

English:
Scheduling must account for capacity, constraints, locks, retries, and failure recovery.

中文注解：
调度绝不是简单“选一台机器”，还要考虑容量快照是否过期、资源是否被占、任务是否重复执行。

## 12. Billing Considerations / 计费注意点

English:
Define pricing dimensions early and keep raw usage events immutable for recalculation.

中文注解：
你需要尽早确定按输入 token、输出 token、请求次数还是实例时长计费，否则后面账单口径会反复改。

## 13. Security Baseline / 安全基线

English:
Hash API keys at rest, isolate tenant data, protect admin routes with RBAC, and authenticate node registration.

中文注解：
最基础的安全要求必须从第一版开始做，不然后面补起来代价很高。

## 14. Observability Baseline / 观测基线

English:
Collect structured logs, deployment logs, node heartbeats, billing metrics, and alert signals.

中文注解：
部署失败率、节点失联、低余额、计费任务失败，这些都应该尽早具备可观测性。

## 15. MVP Scope / MVP 范围

English:
The MVP should include login, API key management, model catalog, basic balance display, node management, deployment creation, gateway forwarding, usage recording, and billing ledger display.

中文注解：
MVP 的重点不是全功能，而是先跑通“开通 -> 部署 -> 调用 -> 计量 -> 计费”。

## 16. Delivery Sequence / 交付顺序

English:
Build in the order of foundation, commercial basics, deployment, runtime access, billing, and hardening.

中文注解：
顺序不能乱。先有身份和资源，再有调用；先有 usage，再有账单。

## 17. Key Risks / 关键风险

English:
The main risks are underestimated scheduling complexity, overengineering too early, weak idempotency, and ambiguous billing rules.

中文注解：
这几个点如果没控制住，后面最容易导致返工、线上故障和客户纠纷。

## 18. Recommendation / 结论建议

English:
The best starting stack for this project is monorepo + Next.js + NestJS + PostgreSQL + Prisma + Redis + BullMQ + Docker-based SGLang deployment.

中文注解：
这是对你当前阶段最均衡的一套方案，复杂度适中，可持续推进。
