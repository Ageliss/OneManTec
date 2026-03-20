-- OneManTec core schema draft
-- 这份 SQL 先用于把核心表边界写清楚，后续再迁移到 Prisma schema。

create table tenants (
  id text primary key,
  name text not null,
  status text not null default 'active',
  billing_mode text not null default 'prepaid',
  created_at timestamptz not null default now()
);

create table projects (
  id text primary key,
  tenant_id text not null references tenants(id),
  name text not null,
  environment text not null default 'prod',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table api_keys (
  id text primary key,
  tenant_id text not null references tenants(id),
  project_id text references projects(id),
  key_prefix text not null,
  key_hash text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table api_key_policies (
  id text primary key,
  api_key_id text not null references api_keys(id),
  allowed_models jsonb not null default '[]'::jsonb,
  allowed_ips jsonb not null default '[]'::jsonb,
  blocked_ips jsonb not null default '[]'::jsonb,
  max_requests_per_minute integer,
  created_at timestamptz not null default now()
);

create table quota_policies (
  id text primary key,
  tenant_id text not null references tenants(id),
  project_id text references projects(id),
  monthly_limit numeric(18, 6) not null default 0,
  soft_limit_ratio numeric(5, 4) not null default 0.8000,
  hard_stop boolean not null default true,
  created_at timestamptz not null default now()
);

create table products (
  id text primary key,
  code text not null unique,
  name text not null,
  product_type text not null,
  settlement_type text not null,
  created_at timestamptz not null default now()
);

create table plan_prices (
  id text primary key,
  product_id text not null references products(id),
  pricing_version integer not null,
  input_token_price numeric(18, 6) not null default 0,
  output_token_price numeric(18, 6) not null default 0,
  request_base_price numeric(18, 6) not null default 0,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

create table provider_credentials (
  id text primary key,
  tenant_id text references tenants(id),
  provider_code text not null,
  credential_type text not null,
  secret_ciphertext text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table deployments (
  id text primary key,
  project_id text references projects(id),
  model_name text not null,
  target_node text not null,
  endpoint text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table routing_rules (
  id text primary key,
  project_id text references projects(id),
  model_alias text not null,
  preferred_targets jsonb not null default '[]'::jsonb,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table usage_events (
  id text primary key,
  tenant_id text not null references tenants(id),
  project_id text references projects(id),
  api_key_id text references api_keys(id),
  deployment_id text references deployments(id),
  model_name text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  request_count integer not null default 1,
  estimated_cost numeric(18, 6) not null default 0,
  created_at timestamptz not null default now()
);

create table ledger_entries (
  id text primary key,
  tenant_id text not null references tenants(id),
  usage_event_id text references usage_events(id),
  amount numeric(18, 6) not null,
  balance_after numeric(18, 6) not null,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

create table recharge_orders (
  id text primary key,
  tenant_id text not null references tenants(id),
  amount numeric(18, 6) not null,
  currency text not null default 'USD',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table invoices (
  id text primary key,
  tenant_id text not null references tenants(id),
  recharge_order_id text references recharge_orders(id),
  invoice_code text,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table refunds (
  id text primary key,
  tenant_id text not null references tenants(id),
  recharge_order_id text references recharge_orders(id),
  amount numeric(18, 6) not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table risk_events (
  id text primary key,
  tenant_id text references tenants(id),
  api_key_id text references api_keys(id),
  risk_type text not null,
  severity text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
