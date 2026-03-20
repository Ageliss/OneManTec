# Initial Plan / 初版开发计划

## 1. Project Target / 项目目标

English:
Build a maintainable first version of the platform that covers customer-facing API delivery, internal scheduling, SGLang deployment orchestration, and API metering and billing.

中文注解：
第一版的目标不是“大而全”，而是做出一个结构正确、可持续扩展、能跑业务闭环的平台。

## 2. Phase Plan / 阶段计划

### Phase 0: Project Foundation / 项目基础

English:
Establish repository structure, confirm the technical stack, and prepare the key design documents.

中文注解：
先把目录、技术路线和文档定下来，解决“以后怎么不乱”的问题。

Deliverables / 交付物：

- monorepo layout
- architecture overview
- MVP roadmap
- initial execution plan

### Phase 1: Engineering Scaffold / 工程脚手架

English:
Make the repository ready for local development and future expansion.

中文注解：
这个阶段重点是让项目“能启动、能安装、能扩展”，不是追求业务完整。

Deliverables / 交付物：

- workspace setup
- TypeScript base config
- lint and format setup
- app skeletons for portal, admin, and api-server
- environment variable conventions

### Phase 2: Account and Access / 账号与访问

English:
Enable customer and operator authentication flows.

中文注解：
这一阶段解决身份、租户、权限和 API Key 这些最基础的入口能力。

Deliverables / 交付物：

- users and tenants schema
- auth module
- role checks
- API key management

### Phase 3: Model and Deployment / 模型与部署

English:
Enable operators to manage models, machines, and deployment tasks.

中文注解：
这是平台从“管理系统”走向“实际控制推理服务”的关键阶段。

Deliverables / 交付物：

- model registry
- node registry
- deployment task API
- scheduler worker
- SGLang deployment integration

### Phase 4: Runtime Request Path / 运行时请求链路

English:
Provide a stable inference access path for customers.

中文注解：
这一步打通后，客户才能真正通过你的平台调用模型。

Deliverables / 交付物：

- runtime gateway
- runtime auth and rate limit
- model routing
- request logs

### Phase 5: Metering and Billing / 计量与计费

English:
Close the business loop with usage ingestion, cost calculation, and ledger generation.

中文注解：
这一步让平台从“提供能力”变成“可以商业化运营”。

Deliverables / 交付物：

- usage event ingestion
- cost calculation
- ledger entries
- customer billing page

### Phase 6: Hardening / 稳定性加固

English:
Improve reliability, visibility, and operational safety.

中文注解：
这一阶段是从“能跑”走向“能稳定跑”。

Deliverables / 交付物：

- health checks
- deployment retries
- alerting
- better audit logs
- basic tests for scheduling and billing

## 3. Immediate Task List / 当前最优先任务

English:
The next concrete tasks are workspace tooling, app scaffolding, database schema, and the auth-tenant-api-key modules.

中文注解：
下一步最值得做的是把工程底盘、数据库主干和入口模块先建立起来。

具体任务 / Concrete tasks：

1. initialize workspace tooling
2. scaffold `apps/web-portal`
3. scaffold `apps/web-admin`
4. scaffold `apps/api-server`
5. add Prisma schema and first migrations
6. add auth, tenant, and API key modules

## 4. Design Rules / 设计规则

English:
Keep domain modules separated, split runtime APIs from console APIs, design deployment and billing flows to be idempotent, and write raw usage events before deriving billing.

中文注解：
这些规则的目的很直接：减少后面重构和线上事故的概率。

## 5. Initial Milestone Success Criteria / 初始里程碑完成标准

English:
The initial milestone is complete when the repository runs locally, the backend connects to the database, both frontends render basic shells, and auth with API keys works end to end.

中文注解：
也就是说，第一阶段要做到“工程能跑、页面能起、身份能通”，而不是功能全做完。

## 6. Extra Notes / 额外提醒

English:
This platform is closer to a compact AI resource and billing platform than to a simple website.

中文注解：
最容易低估的是调度复杂度和计费一致性，最容易写乱的是把页面逻辑、业务逻辑和数据库逻辑混在一起。

English:
At this stage, clear directories, layered modules, and a closed core workflow matter more than visual polish.

中文注解：
现阶段最重要的不是页面多漂亮，而是目录清楚、模块分层、链路闭环。
