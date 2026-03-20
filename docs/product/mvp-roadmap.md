# MVP Roadmap / MVP 路线图

## 1. Objective / 目标

Deliver the smallest useful version of the platform that proves the full business loop: access, routing, usage recording, and billing.

MVP 的目标不是把所有页面做全，而是证明这条闭环成立：客户能调用，平台能转发，usage 能记录，费用能生成。

## 2. MVP User Roles / MVP 用户角色

### 2.1 Customer / 客户

The customer should be able to log in, create API keys, browse models, view usage, view balance, and read API docs.

客户侧功能要尽量围绕“开通和使用”展开，不要一开始加太多复杂协作功能。

The customer should also see project-level usage, budget status, and key-level controls in the first usable version.

项目视角、预算概览和 key 控制应尽量早出现。

### 2.2 Operator / 运营者

The operator should be able to manage users, machines, models, deployments, and billing records.

管理侧重点是资源和商业配置，而不是做复杂 BI。

The operator should also manage routing policies, quota strategies, pricing versions, and reconciliation actions.

后台需要提前承接治理类能力，而不只是资源管理。

The operator should eventually also manage product packages, settlement records, provider credentials, and risk events.

这些能力可以晚一点做深，但必须进入后台规划。

## 3. MVP Pages / MVP 页面

### 3.1 Customer Portal / 客户门户

Recommended pages: `/login`, `/dashboard`, `/api-keys`, `/models`, `/usage`, `/billing`, `/docs`.

这是最小可用页面集合，足够支撑客户完成自助使用。

The portal should also reserve sections for project switching, budget summary, and API key policy details.

不一定全部独立成页面，但结构上要先预留。

### 3.2 Admin Console / 管理后台

Recommended pages: `/admin/login`, `/admin/dashboard`, `/admin/users`, `/admin/models`, `/admin/nodes`, `/admin/deployments`, `/admin/pricing`, `/admin/audit`.

这些页面能支撑平台运营、部署和审计的核心操作。

The admin console should also reserve `/admin/routing`, `/admin/quotas`, `/admin/projects`, and `/admin/reconciliation`.

这些治理页面可以先做轻量版，但路径和职责要先进入规划。

It should also reserve future sections for `/admin/products`, `/admin/settlement`, `/admin/providers`, and `/admin/risk`.

商业化、上游凭证和风控页面也建议提前定好位置。

## 4. MVP Backend Modules / MVP 后端模块

### 4.1 Must Build / 必做模块

Must-build modules are auth, tenant, api-key, model-registry, node-registry, deployment, scheduler, gateway, usage-metering, and billing-ledger.

这些模块缺任何一个，平台闭环都会断。

The must-build list should also include project-management, routing-policy-basic, quota-budget-basic, api-key-governance-basic, and usage-analytics-basic.

这些新增模块至少要做基础版，否则平台很难支撑真实客户。

### 4.2 Can Wait / 可后置模块

Notifications, invoices, multi-region routing, advanced autoscaling, and team collaboration can wait.

这些需求确实有价值，但不应该抢在主链路前面。

BYOK, advanced risk control, and a full customer support center can be deferred until after the first online version.

这些能力值得做，但可以放在 MVP 之后补强。

Recharge and invoice workflows may stay lightweight in MVP, but product package modeling and settlement table planning should happen early.

充值和开票可以先轻量实现，但产品套餐建模和结算表设计应尽早规划。

## 5. MVP Database Priority / MVP 数据库优先级

Build the first schema around users, tenants, tenant_members, api_keys, models, model_versions, nodes, deployments, deployment_tasks, usage_events, and ledger_entries.

这些表就是第一版业务主干，先把它们定清楚，后面的代码才不会频繁返工。

The first schema should also reserve projects, environments, api_key_policies, routing_rules, quota_policies, usage_rollups, and billing_adjustments.

这些表就算不马上 fully implement，也应先规划进 schema。

It should also reserve products, plan_prices, provider_credentials, byo_keys, recharge_orders, invoices, refunds, and risk_events.

这些表主要是为未来商业化和风控做准备。

## 6. Suggested Delivery Order / 推荐交付顺序

### Stage 1 / 第一阶段

Scaffold the monorepo, frontend apps, backend app, shared config, and PostgreSQL plus Prisma.

先把工程底盘搭好，否则后面每加一个模块都在重复打底。

Exit criteria / 退出标准：

- apps compile
- database connects
- base auth route works

### Stage 2 / 第二阶段

Implement login, tenant model, API key management, and a basic customer dashboard shell.

这一步主要解决“人和凭证”的问题。

This stage should also establish project boundaries and the first version of API key policy controls.

项目和 key 策略最好跟身份体系一起落地。

Exit criteria / 退出标准：

- customer can sign in
- customer can create and revoke API key

### Stage 3 / 第三阶段

Implement node registration, model registry, deployment task creation, scheduler worker, and deployment status page.

这一步开始让平台真正接管机器和部署流程。

Exit criteria / 退出标准：

- operator can submit deployment task
- task can place model on a target machine
- deployment status is visible

### Stage 4 / 第四阶段

Implement runtime gateway, request validation, forwarding to SGLang, and usage recording.

这一步完成之后，平台才具备真实对外服务能力。

This stage should also include model alias routing, basic failover, and quota enforcement in the request path.

否则运行时还只是请求透传，不算真正的平台控制层。

Exit criteria / 退出标准：

- customer can call one inference API successfully
- request logs can be queried

### Stage 5 / 第五阶段

Implement pricing rules, cost calculation, ledger UI, and low-balance checks.

这一步把“能用”变成“能收费”。

This stage should also include usage dashboards, exportable summaries, pricing rule versioning, and manual billing adjustment support.

这样平台才能兼顾客户看账单和你自己处理对账问题。

This stage should at least define lightweight recharge and settlement records even if the external payment loop is still simple.

即使第一版支付很简单，充值和结算记录也应先有规范结构。

Exit criteria / 退出标准：

- each request produces billable usage records
- customer can see accumulated charges

## 7. Non-Functional Baseline / 非功能基线

Keep strict TypeScript, linting, migration-based schema management, structured logs, role-based admin access, and basic tests for billing and scheduling.

这些不是锦上添花，而是为了避免早期项目失控。

## 8. What Not To Do Too Early / 不要过早做的事

Do not build too many microservices, do not adopt Kubernetes first, do not build a complex visual scheduler too early, and do not overdesign pricing.

你现在最需要的是跑通主链路，不是做复杂架构展示。

## 9. Definition Of Success / 成功标准

The MVP is successful when an operator can deploy a model, a customer can call it with an API key, usage and cost are recorded correctly, and both sides can see the state in the UI.

一句话概括就是：平台能真正承接业务，而不是只有演示页面。

The MVP should also support project-level isolation, a simple budget policy, key-level usage visibility, and at least one editable routing rule.

做到这一步，平台才具备最基础的治理能力。

After reviewing the full design, the remaining modules that should be planned now are product packaging, settlement, provider credentials, and risk-control foundations.

整体再看一遍后，这 4 类能力也应进入设计预留范围。
