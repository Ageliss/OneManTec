# Initial Plan / 初版开发计划

## 1. Project Target / 项目目标

Build a maintainable first version of the platform that covers customer-facing API delivery, internal scheduling, SGLang deployment orchestration, and API metering and billing.

第一版的目标不是“大而全”，而是做出一个结构正确、可持续扩展、能跑业务闭环的平台。

## 2. Phase Plan / 阶段计划

### Phase 0: Project Foundation / 项目基础

Establish repository structure, confirm the technical stack, and prepare the key design documents.

先把目录、技术路线和文档定下来，解决“以后怎么不乱”的问题。

Deliverables / 交付物：

- monorepo layout
- architecture overview
- MVP roadmap
- initial execution plan
- governance module planning
- gap-analysis integration
- product and settlement planning
- provider credential and risk-control planning

### Phase 1: Engineering Scaffold / 工程脚手架

Make the repository ready for local development and future expansion.

这个阶段重点是让项目“能启动、能安装、能扩展”，不是追求业务完整。

Deliverables / 交付物：

- workspace setup
- TypeScript base config
- lint and format setup
- app skeletons for portal, admin, and api-server
- environment variable conventions
- reserved module slots for routing, quota, project, analytics, and reconciliation
- reserved module slots for products, settlement, provider credentials, and risk control

### Phase 2: Account and Access / 账号与访问

Enable customer and operator authentication flows.

这一阶段解决身份、租户、权限和 API Key 这些最基础的入口能力。

Deliverables / 交付物：

- users and tenants schema
- auth module
- role checks
- API key management
- project and environment skeleton
- basic API key policy support
- secret storage and provider credential skeleton

### Phase 3: Model and Deployment / 模型与部署

Enable operators to manage models, machines, and deployment tasks.

这是平台从“管理系统”走向“实际控制推理服务”的关键阶段。

Deliverables / 交付物：

- model registry
- node registry
- deployment task API
- scheduler worker
- SGLang deployment integration
- routing target registry

### Phase 4: Runtime Request Path / 运行时请求链路

Provide a stable inference access path for customers.

这一步打通后，客户才能真正通过你的平台调用模型。

Deliverables / 交付物：

- runtime gateway
- runtime auth and rate limit
- model routing
- request logs
- quota enforcement
- failover-ready routing policy

### Phase 5: Metering and Billing / 计量与计费

Close the business loop with usage ingestion, cost calculation, and ledger generation.

这一步让平台从“提供能力”变成“可以商业化运营”。

Deliverables / 交付物：

- usage event ingestion
- cost calculation
- ledger entries
- customer billing page
- usage rollups
- pricing rule versions
- billing adjustment support
- recharge and settlement records

### Phase 6: Hardening / 稳定性加固

Improve reliability, visibility, and operational safety.

这一阶段是从“能跑”走向“能稳定跑”。

Deliverables / 交付物：

- health checks
- deployment retries
- alerting
- better audit logs
- basic tests for scheduling and billing
- abnormal usage alerts
- reconciliation tooling
- risk event handling

## 3. Immediate Task List / 当前最优先任务

The next concrete tasks are workspace tooling, app scaffolding, database schema, and the auth-tenant-project-api-key-quota-product foundation modules.

下一步最值得做的是把工程底盘、数据库主干，以及项目、预算、key 治理、产品和结算这些基础模块先建立起来。

具体任务 / Concrete tasks：

1. initialize workspace tooling
2. scaffold `apps/web-portal`
3. scaffold `apps/web-admin`
4. scaffold `apps/api-server`
5. add Prisma schema and first migrations
6. add auth, tenant, project, and API key modules
7. add quota and routing policy skeleton
8. reserve settlement, provider credential, and risk-control tables

## 4. Design Rules / 设计规则

Keep domain modules separated, split runtime APIs from console APIs, design deployment and billing flows to be idempotent, write raw usage events before deriving billing, and reserve explicit places for routing, project, quota, analytics, reconciliation, settlement, provider credentials, and risk control.

这些规则的目的很直接：减少后面重构和线上事故的概率。

## 5. Initial Milestone Success Criteria / 初始里程碑完成标准

The initial milestone is complete when the repository runs locally, the backend connects to the database, both frontends render basic shells, auth with API keys works end to end, and project plus quota skeletons are in place.

也就是说，第一阶段要做到“工程能跑、页面能起、身份能通、治理骨架已预留”，而不是功能全做完。

## 6. Extra Notes / 额外提醒

This platform is closer to a compact AI resource and billing platform than to a simple website.

最容易低估的是调度复杂度和计费一致性，最容易写乱的是把页面逻辑、业务逻辑和数据库逻辑混在一起。

Another common mistake is treating routing, budgets, projects, and key governance as optional add-ons instead of first-class product capabilities.

另一个常见错误，是把路由、预算、项目和 key 治理当成后补功能，而不是主设计的一部分。

Another missing area in early designs is product packaging, payment settlement, provider secret management, and abuse prevention.

另一个容易漏掉的地方，是产品套餐、支付结算、上游密钥管理和滥用防护。

At this stage, clear directories, layered modules, and a closed core workflow matter more than visual polish.

现阶段最重要的不是页面多漂亮，而是目录清楚、模块分层、链路闭环。
