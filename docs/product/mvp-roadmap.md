# MVP Roadmap

## 1. Objective

Deliver the smallest useful version of the platform that proves the full business loop:

- customer gets API access
- platform routes requests to deployed SGLang service
- usage is recorded
- billing is generated

## 2. MVP User Roles

### 2.1 Customer

- logs in
- creates API keys
- views available models
- checks usage and balance
- reads API docs

### 2.2 Operator

- manages users
- manages machine pool
- publishes models
- starts deployments
- checks deployment status
- checks billing records

## 3. MVP Pages

### 3.1 Customer Portal

- `/login`
- `/dashboard`
- `/api-keys`
- `/models`
- `/usage`
- `/billing`
- `/docs`

### 3.2 Admin Console

- `/admin/login`
- `/admin/dashboard`
- `/admin/users`
- `/admin/models`
- `/admin/nodes`
- `/admin/deployments`
- `/admin/pricing`
- `/admin/audit`

## 4. MVP Backend Modules

### 4.1 Must Build

- auth
- tenant
- api-key
- model-registry
- node-registry
- deployment
- scheduler
- gateway
- usage-metering
- billing-ledger

### 4.2 Can Wait

- notifications center
- invoices
- multi-region routing
- advanced autoscaling
- team collaboration

## 5. MVP Database Priority

Build these tables first:

- users
- tenants
- tenant_members
- api_keys
- models
- model_versions
- nodes
- deployments
- deployment_tasks
- usage_events
- ledger_entries

## 6. Suggested Delivery Order

### Stage 1

- monorepo scaffold
- frontend apps scaffold
- backend app scaffold
- shared types and config
- PostgreSQL + Prisma init

Exit criteria:

- apps compile
- database connects
- base auth route works

### Stage 2

- login
- tenant model
- API key management
- customer dashboard shell

Exit criteria:

- customer can sign in
- customer can create and revoke API key

### Stage 3

- node registration
- model registry
- deployment task creation
- scheduler worker
- deployment status page

Exit criteria:

- operator can submit deployment task
- task can place model on a target machine
- deployment status is visible

### Stage 4

- runtime gateway
- request validation
- forwarding to SGLang
- request and usage event recording

Exit criteria:

- customer can call one inference API successfully
- request logs can be queried

### Stage 5

- pricing rules
- cost calculation
- ledger UI
- low-balance checks

Exit criteria:

- each request produces billable usage records
- customer can see accumulated charges

## 7. Non-Functional Baseline

Even in MVP, keep these:

- TypeScript strict mode
- lint and formatter
- migration-based schema management
- structured logs
- role-based admin routes
- basic test coverage for billing and scheduling logic

## 8. What Not To Do Too Early

- do not build too many microservices
- do not adopt Kubernetes first
- do not build a complex visual scheduler before task execution works
- do not overdesign pricing before one clear billing rule is live

## 9. Definition Of Success

The MVP is successful when:

1. an operator can register a node and deploy a model
2. a customer can obtain an API key and call the model
3. the platform records usage and cost correctly
4. both customer and operator can see the resulting state in the UI
