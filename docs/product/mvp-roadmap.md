# MVP Roadmap / MVP 路线图

## 1. Objective / 目标

English:
Deliver the smallest useful version of the platform that proves the full business loop: access, routing, usage recording, and billing.

中文注解：
MVP 的目标不是把所有页面做全，而是证明这条闭环成立：客户能调用，平台能转发，usage 能记录，费用能生成。

## 2. MVP User Roles / MVP 用户角色

### 2.1 Customer / 客户

English:
The customer should be able to log in, create API keys, browse models, view usage, view balance, and read API docs.

中文注解：
客户侧功能要尽量围绕“开通和使用”展开，不要一开始加太多复杂协作功能。

### 2.2 Operator / 运营者

English:
The operator should be able to manage users, machines, models, deployments, and billing records.

中文注解：
管理侧重点是资源和商业配置，而不是做复杂 BI。

## 3. MVP Pages / MVP 页面

### 3.1 Customer Portal / 客户门户

English:
Recommended pages: `/login`, `/dashboard`, `/api-keys`, `/models`, `/usage`, `/billing`, `/docs`.

中文注解：
这是最小可用页面集合，足够支撑客户完成自助使用。

### 3.2 Admin Console / 管理后台

English:
Recommended pages: `/admin/login`, `/admin/dashboard`, `/admin/users`, `/admin/models`, `/admin/nodes`, `/admin/deployments`, `/admin/pricing`, `/admin/audit`.

中文注解：
这些页面能支撑平台运营、部署和审计的核心操作。

## 4. MVP Backend Modules / MVP 后端模块

### 4.1 Must Build / 必做模块

English:
Must-build modules are auth, tenant, api-key, model-registry, node-registry, deployment, scheduler, gateway, usage-metering, and billing-ledger.

中文注解：
这些模块缺任何一个，平台闭环都会断。

### 4.2 Can Wait / 可后置模块

English:
Notifications, invoices, multi-region routing, advanced autoscaling, and team collaboration can wait.

中文注解：
这些需求确实有价值，但不应该抢在主链路前面。

## 5. MVP Database Priority / MVP 数据库优先级

English:
Build the first schema around users, tenants, tenant_members, api_keys, models, model_versions, nodes, deployments, deployment_tasks, usage_events, and ledger_entries.

中文注解：
这些表就是第一版业务主干，先把它们定清楚，后面的代码才不会频繁返工。

## 6. Suggested Delivery Order / 推荐交付顺序

### Stage 1 / 第一阶段

English:
Scaffold the monorepo, frontend apps, backend app, shared config, and PostgreSQL plus Prisma.

中文注解：
先把工程底盘搭好，否则后面每加一个模块都在重复打底。

Exit criteria / 退出标准：

- apps compile
- database connects
- base auth route works

### Stage 2 / 第二阶段

English:
Implement login, tenant model, API key management, and a basic customer dashboard shell.

中文注解：
这一步主要解决“人和凭证”的问题。

Exit criteria / 退出标准：

- customer can sign in
- customer can create and revoke API key

### Stage 3 / 第三阶段

English:
Implement node registration, model registry, deployment task creation, scheduler worker, and deployment status page.

中文注解：
这一步开始让平台真正接管机器和部署流程。

Exit criteria / 退出标准：

- operator can submit deployment task
- task can place model on a target machine
- deployment status is visible

### Stage 4 / 第四阶段

English:
Implement runtime gateway, request validation, forwarding to SGLang, and usage recording.

中文注解：
这一步完成之后，平台才具备真实对外服务能力。

Exit criteria / 退出标准：

- customer can call one inference API successfully
- request logs can be queried

### Stage 5 / 第五阶段

English:
Implement pricing rules, cost calculation, ledger UI, and low-balance checks.

中文注解：
这一步把“能用”变成“能收费”。

Exit criteria / 退出标准：

- each request produces billable usage records
- customer can see accumulated charges

## 7. Non-Functional Baseline / 非功能基线

English:
Keep strict TypeScript, linting, migration-based schema management, structured logs, role-based admin access, and basic tests for billing and scheduling.

中文注解：
这些不是锦上添花，而是为了避免早期项目失控。

## 8. What Not To Do Too Early / 不要过早做的事

English:
Do not build too many microservices, do not adopt Kubernetes first, do not build a complex visual scheduler too early, and do not overdesign pricing.

中文注解：
你现在最需要的是跑通主链路，不是做复杂架构展示。

## 9. Definition Of Success / 成功标准

English:
The MVP is successful when an operator can deploy a model, a customer can call it with an API key, usage and cost are recorded correctly, and both sides can see the state in the UI.

中文注解：
一句话概括就是：平台能真正承接业务，而不是只有演示页面。
