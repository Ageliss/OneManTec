# OneManTec Platform Overview

## 1. Product Goal

Build a compact but production-oriented platform for:

- customer-facing token/API delivery
- internal resource scheduling and deployment management
- downstream machine orchestration for SGLang inference services
- usage metering and billing

The platform should stay maintainable for a solo founder, so the design must favor:

- clear domain boundaries
- low coupling between modules
- incremental delivery
- operational visibility from day one

## 2. Recommended Product Split

The system should be treated as one platform with multiple surfaces, not just two web pages.

### 2.1 Customer Portal

Used by external customers.

- sign in / sign up
- API key management
- package or balance overview
- usage dashboards
- billing history
- model catalog
- API documentation

### 2.2 Admin Console

Used by the operator.

- user management
- price and package management
- model management
- machine pool management
- deployment task management
- billing and reconciliation
- alerts and audit logs

### 2.3 Runtime Platform Services

Backend services required behind the UI.

- auth and tenant service
- API gateway
- deployment orchestrator
- resource scheduler
- metering and billing service
- notification and observability support

## 3. Domain Modules

These are the core modules that should exist even if some are implemented inside the same codebase in early stages.

### 3.1 Identity and Access

- user account
- tenant / workspace
- roles and permissions
- API keys
- login sessions
- audit logs

### 3.2 Customer and Product

- customer profile
- package plans
- balance account
- quota policy
- model entitlements

### 3.3 Model and Deployment

- model registry
- model version
- runtime template
- deployment spec
- deployment instance
- health status

### 3.4 Resource Scheduling

- machine registration
- node capability reporting
- GPU allocation
- scheduling queue
- resource locking
- retry and compensation

### 3.5 API Gateway and Traffic

- request authentication
- rate limiting
- routing
- fallback policy
- request tracing
- request logs

### 3.6 Metering and Billing

- usage events
- token counting
- per-model pricing
- real-time cost calculation
- monthly statements
- reconciliation

### 3.7 Operations and Observability

- task logs
- deployment logs
- metrics
- alerts
- incident annotations

## 4. Critical Workflows

### 4.1 Customer API Call Flow

1. Customer calls the platform API with an API key.
2. Gateway validates key, tenant, quota, balance, and rate limits.
3. Gateway resolves the target model and active deployment.
4. Request is forwarded to the selected SGLang instance.
5. Response metadata and usage are recorded.
6. Metering creates usage events and billing records.
7. Customer portal displays updated usage and cost.

### 4.2 Deployment Flow

1. Admin creates a deployment task for a model version.
2. Orchestrator validates deployment spec and capacity request.
3. Scheduler selects a target machine or node group.
4. Worker executes deployment on downstream machine.
5. Health check verifies SGLang readiness.
6. Deployment status changes to running, failed, or degraded.
7. On failure, resources are released and retry policy is applied.

### 4.3 Billing Flow

1. Gateway or runtime emits usage events.
2. Metering worker aggregates input/output tokens and request dimensions.
3. Billing service calculates cost using pricing rules.
4. Balance ledger records debit entries.
5. Low-balance or insufficient-balance policy is applied.
6. Statement snapshots are generated for later reconciliation.

## 5. Suggested Architecture

For a solo founder, start with a modular monorepo and a single main backend service, but keep domain boundaries explicit.

### 5.1 Phase 1 Architecture

- one customer frontend
- one admin frontend
- one backend API service
- one scheduler worker
- one metering worker
- one relational database
- one Redis instance

The API gateway can initially be implemented inside the backend or as a thin dedicated service, depending on traffic and security needs.

### 5.2 Phase 2 Evolution

Split out when needed:

- standalone gateway
- standalone billing service
- standalone deployment service

Do not split too early. Keep the code modular first, service split second.

## 6. Recommended Tech Stack

The goal is fast delivery with good maintainability.

### 6.1 Frontend

- framework: Next.js
- language: TypeScript
- UI: Tailwind CSS + a small internal component library
- charts: ECharts or Recharts
- auth session handling: NextAuth or custom JWT session layer

Reason:

- fast page delivery
- good admin and portal support
- SSR or static docs possible
- easy monorepo integration

### 6.2 Backend

- runtime: Node.js
- framework: NestJS or Fastify
- language: TypeScript
- ORM: Prisma
- validation: Zod or class-validator

Suggested preference:

- use NestJS if you want strong module structure and conventional layering
- use Fastify if you want a thinner, lower-ceremony backend

For your scenario, NestJS is slightly better because module boundaries matter more than micro performance right now.

### 6.3 Infra and Runtime

- database: PostgreSQL
- cache / queue support: Redis
- background jobs: BullMQ
- object storage: S3-compatible storage if model assets or logs need archival
- reverse proxy: Nginx or gateway service

### 6.4 Deployment Target

Choose one of these early:

- simple VM + Docker deployment
- Kubernetes-based deployment

Recommendation for MVP:

- start with VM + Docker + SSH/agent deployment
- do not introduce Kubernetes unless you already need multi-node self-healing and autoscaling

## 7. Repository Layout

Recommended monorepo layout:

```text
OneManTec/
  apps/
    web-portal/
    web-admin/
    api-server/
    scheduler-worker/
    metering-worker/
    gateway/

  packages/
    ui/
    config/
    shared/
    domain-auth/
    domain-customer/
    domain-model/
    domain-resource/
    domain-billing/
    domain-gateway/

  database/
    schema/
    migrations/
    seeds/

  docs/
    architecture/
    api/
    product/
    runbooks/

  infra/
    docker/
    scripts/
    nginx/
```

## 8. Backend Module Boundaries

Even if implemented inside one backend service, keep these modules separated:

### 8.1 auth

- login
- tenant membership
- role checks
- API key lifecycle

### 8.2 customer

- customer profile
- package binding
- quota state
- balance account

### 8.3 model

- model catalog
- model version
- runtime presets

### 8.4 deployment

- deployment tasks
- deployment records
- health checks
- rollout and rollback

### 8.5 resource

- node inventory
- resource snapshots
- scheduling decisions
- allocation records

### 8.6 gateway

- API request validation
- routing
- rate limit
- usage capture

### 8.7 billing

- pricing rules
- usage events
- ledger
- invoice statement snapshots

### 8.8 ops

- audit
- alerts
- notifications
- job history

## 9. Core Data Model

This is the minimum set of entities you should plan for.

### 9.1 Identity

- users
- tenants
- tenant_members
- roles
- api_keys
- sessions
- audit_logs

### 9.2 Commercial

- plans
- tenant_plan_bindings
- balances
- ledger_entries
- pricing_rules
- invoices

### 9.3 Model and Runtime

- models
- model_versions
- runtime_templates
- deployments
- deployment_tasks
- deployment_events

### 9.4 Resources

- nodes
- node_heartbeats
- node_resources
- resource_allocations
- scheduler_jobs

### 9.5 Traffic and Billing

- api_requests
- usage_events
- billing_records
- quota_snapshots

## 10. Suggested Table Fields

Only representative fields are listed here.

### 10.1 users

- id
- email
- password_hash
- status
- created_at

### 10.2 tenants

- id
- name
- status
- billing_mode
- created_at

### 10.3 api_keys

- id
- tenant_id
- key_prefix
- key_hash
- status
- last_used_at
- created_at

Store only hash and a displayable prefix, never the raw key after creation.

### 10.4 models

- id
- name
- provider
- category
- status

### 10.5 model_versions

- id
- model_id
- version
- image_uri
- startup_command
- default_config_json
- status

### 10.6 nodes

- id
- hostname
- ip_address
- region
- status
- scheduler_state

### 10.7 node_resources

- id
- node_id
- gpu_count
- gpu_memory_mb
- cpu_cores
- memory_mb
- disk_mb
- reported_at

### 10.8 deployments

- id
- tenant_id
- model_version_id
- node_id
- desired_replicas
- actual_replicas
- endpoint
- status

### 10.9 deployment_tasks

- id
- deployment_id
- task_type
- payload_json
- status
- retry_count
- error_message
- created_at

### 10.10 usage_events

- id
- tenant_id
- api_key_id
- deployment_id
- model_id
- input_tokens
- output_tokens
- request_count
- duration_ms
- occurred_at

### 10.11 ledger_entries

- id
- tenant_id
- entry_type
- amount
- currency
- related_usage_event_id
- balance_after
- created_at

## 11. API Surface

Split APIs into three categories.

### 11.1 Customer APIs

- `POST /auth/login`
- `GET /me`
- `GET /models`
- `GET /usage/summary`
- `GET /billing/ledger`
- `POST /api-keys`
- `DELETE /api-keys/:id`

### 11.2 Admin APIs

- `GET /admin/users`
- `POST /admin/models`
- `POST /admin/deployments`
- `POST /admin/deployment-tasks/:id/retry`
- `GET /admin/nodes`
- `PATCH /admin/pricing-rules/:id`

### 11.3 Runtime APIs

- `POST /v1/chat/completions`
- `POST /v1/completions`
- `GET /v1/models`

Keep runtime APIs isolated from console APIs. Different auth, rate limits, and logs apply.

## 12. Scheduling Considerations

The scheduler is not just a CRUD module. It needs explicit policies.

### 12.1 Scheduling Inputs

- required GPU count
- required GPU memory
- model-specific constraints
- region affinity
- tenant isolation policy
- current node load

### 12.2 Scheduling Outputs

- selected node
- allocation record
- task lease
- retry policy

### 12.3 Failure Cases

- node offline during deployment
- partial deployment success
- health check timeout
- stale resource snapshot
- duplicate task execution

Use resource allocation rows and task leases to guarantee idempotency.

## 13. Billing Considerations

Define billing policy before implementation.

### 13.1 Possible Charging Dimensions

- input tokens
- output tokens
- request count
- occupied runtime duration
- reserved instance duration

### 13.2 Recommended MVP Billing Policy

Start with:

- charge by input tokens
- charge by output tokens
- optional request minimum fee

Avoid charging by occupied GPU duration in MVP unless your business explicitly sells dedicated instances.

### 13.3 Financial Safety Rules

- every usage event must have a unique idempotency key
- ledger writes must be transactional
- billing recalculation must be repeatable
- raw usage events should never be overwritten

## 14. Security Requirements

Minimum security baseline:

- API keys hashed at rest
- admin APIs protected with RBAC
- operation audit logs
- per-tenant data isolation
- node registration authentication
- secrets not stored in frontend
- rate limiting on auth and runtime APIs

## 15. Observability Requirements

You will need this much earlier than expected.

- structured logs for all requests and jobs
- deployment task logs
- node heartbeat status
- billing event processing metrics
- alerting for deployment failure rate and low balance

## 16. MVP Scope

Do not build everything first. Start with the minimum closed-loop platform.

### MVP includes

- customer login
- API key management
- model catalog
- basic balance or quota display
- admin machine pool management
- admin deployment creation
- scheduler worker for single-node deployment
- gateway request auth and forwarding
- usage event recording
- simple billing ledger display

### MVP excludes

- multi-region routing
- advanced autoscaling
- invoice issuance
- team collaboration features
- full Kubernetes operator
- complex revenue analytics

## 17. Delivery Sequence

### Phase 0: foundation

- monorepo setup
- lint / format / test baseline
- shared config
- auth skeleton
- database schema init

### Phase 1: commercial basics

- tenant and API key management
- plans and balances
- customer portal basics

### Phase 2: model deployment

- node registry
- model registry
- deployment tasks
- scheduler worker
- SGLang runtime integration

### Phase 3: runtime access

- API gateway
- request forwarding
- rate limit
- request logs

### Phase 4: billing loop

- usage events
- billing records
- ledger and usage dashboard

### Phase 5: operational hardening

- alerts
- retry policies
- rollback support
- audit improvements

## 18. Key Risks

### 18.1 Underestimated scope

The biggest risk is treating scheduling and billing as side features. They are core product capabilities.

### 18.2 Overengineering too early

Do not split into too many services before you have real load or team growth.

### 18.3 Weak deployment idempotency

If deployment tasks can run twice without guards, resource accounting and service state will diverge.

### 18.4 Ambiguous billing rules

If pricing logic is not explicit early, customer disputes and code rewrites will follow.

## 19. Strong Recommendation

The best starting point for your case:

- monorepo
- Next.js for both frontends
- NestJS for backend
- PostgreSQL + Prisma
- Redis + BullMQ
- Docker-based downstream deployment of SGLang

This is simple enough for one person, but still structured enough to grow.

## 20. Next Steps

Suggested immediate next actions:

1. finalize tech stack
2. define database schema
3. scaffold monorepo
4. implement auth, tenant, and API key modules
5. implement node registry and deployment tasks
6. implement gateway and usage metering

Once these are in place, the platform can evolve without major structural rewrites.
