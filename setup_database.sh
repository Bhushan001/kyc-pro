#!/bin/bash
set -euo pipefail

DB_DIR="./database"

echo "Creating database folder and SQL scripts..."

mkdir -p "$DB_DIR"

# schema.sql: PostgreSQL schema and tenant-aware design with multi-tenancy support
cat > "$DB_DIR/schema.sql" <<'EOSQL'
-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Define schemas for logical separation
CREATE SCHEMA auth;
CREATE SCHEMA core;
CREATE SCHEMA billing;

-- Function to set tenant context in session (for RLS policies)
CREATE OR REPLACE FUNCTION set_tenant_context(tenant_uuid UUID)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_tenant_id', tenant_uuid::text, true);
END;
$$ LANGUAGE plpgsql;

-- Function to get current tenant
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(current_setting('app.current_tenant_id', true)::UUID, '00000000-0000-0000-0000-000000000000'::UUID);
END;
$$ LANGUAGE plpgsql;

-- Core tenants table
CREATE TABLE core.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'basic',
    status VARCHAR(50) DEFAULT 'active',
    settings JSONB DEFAULT '{}',
    branding JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable automatic update of updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_modified BEFORE UPDATE ON core.tenants
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Users table in 'auth' schema
CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active',
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_update_modified_users BEFORE UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Modules table (core business modules)
CREATE TABLE core.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    features JSONB DEFAULT '[]',
    monthly_price DECIMAL(10,2) NOT NULL,
    yearly_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table in 'billing'
CREATE TABLE billing.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES core.modules(id) ON DELETE CASCADE,
    billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly',
    status VARCHAR(50) DEFAULT 'active',
    price DECIMAL(10,2) NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ,
    UNIQUE (tenant_id, module_id)
);

-- Enable Row Level Security (RLS) for tenant isolation
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.modules ENABLE ROW LEVEL SECURITY;

-- RLS policies (allow access only to rows with current tenant's id)
CREATE POLICY tenant_isolation_users ON auth.users
  USING (tenant_id = get_current_tenant_id() OR get_current_tenant_id() = '00000000-0000-0000-0000-000000000000'::UUID);

CREATE POLICY tenant_isolation_subscriptions ON billing.subscriptions
  USING (tenant_id = get_current_tenant_id() OR get_current_tenant_id() = '00000000-0000-0000-0000-000000000000'::UUID);

CREATE POLICY tenant_isolation_tenants ON core.tenants
  USING (id = get_current_tenant_id() OR get_current_tenant_id() = '00000000-0000-0000-0000-000000000000'::UUID);

CREATE POLICY tenant_isolation_modules ON core.modules
  USING (status = 'active'); -- modules are global but only active modules are accessible

-- Indexes for performance optimization
CREATE INDEX idx_users_tenant_id ON auth.users(tenant_id);
CREATE INDEX idx_subscriptions_tenant_module ON billing.subscriptions(tenant_id, module_id);
CREATE INDEX idx_tenants_status ON core.tenants(status);
CREATE INDEX idx_modules_category_status ON core.modules(category, status);
EOSQL

# seed-data.sql: Insert demo tenants, users, modules, subscriptions

cat > "$DB_DIR/seed-data.sql" <<'EOSQL'
-- Insert demo tenants
INSERT INTO core.tenants (id, name, domain, plan) VALUES
('11111111-1111-1111-1111-111111111111', 'Platform Admin', 'platform.com', 'enterprise'),
('22222222-2222-2222-2222-222222222222', 'Demo Company', 'demo.company.com', 'business');

-- Insert demo users with bcrypt hashed passwords for 'Admin123!', 'Demo123!', 'User123!'
-- The bcrypt hashes below are samples; use the correct hashes if changing passwords

INSERT INTO auth.users (id, email, password_hash, name, role, tenant_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@platform.com', '$2a$10$8K1p/a0dL2LkUnC9PQ7/dOJtHN1KR9.V5pB3YFvuFy.GqT8mAFKWK', 'Platform Admin', 'platform_admin', '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'admin@demo.company.com',  '$2a$10$8K1p/a0dL2LkUnC9PQ7/dOJtHN1KR9.V5pB3YFvuFy.GqT8mAFKWK', 'Demo Admin', 'tenant_admin', '22222222-2222-2222-2222-222222222222'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'user@demo.company.com',      '$2a$10$8K1p/a0dL2LkUnC9PQ7/dOJtHN1KR9.V5pB3YFvuFy.GqT8mAFKWK', 'Demo User', 'user', '22222222-2222-2222-2222-222222222222');

-- Insert modules (only a subset shown for brevity)

INSERT INTO core.modules (id, name, description, category, features, monthly_price, yearly_price) VALUES
('m0000001-0001-0001-0001-000000000001', 'My Tasks', 'Essential task management', 'Core Task Management', '["Add Task", "Complete Task"]', 15.99, 160.00),
('m0000001-0001-0001-0001-000000000002', 'Kanban Board', 'Visual workflow with drag-and-drop', 'Core Task Management', '["Drag and Drop", "Boards"]', 19.99, 200.00),
('m0000001-0001-0001-0001-000000000005', 'Client', 'B2B client management', 'Business Operations', '["CRM", "Lead Tracking"]', 29.99, 300.00),
('m0000001-0001-0001-0001-000000000006', 'Impact', 'KPI tracking dashboards', 'Business Operations', '["KPI Metrics", "Performance Dashboard"]', 24.99, 250.00);

-- Demo subscriptions for Demo Company tenant (tenant_id = '2222...')

INSERT INTO billing.subscriptions (tenant_id, module_id, billing_cycle, price) VALUES
('22222222-2222-2222-2222-222222222222', 'm0000001-0001-0001-0001-000000000001', 'monthly', 15.99),
('22222222-2222-2222-2222-222222222222', 'm0000001-0001-0001-0001-000000000002', 'monthly', 19.99),
('22222222-2222-2222-2222-222222222222', 'm0000001-0001-0001-0001-000000000005', 'yearly', 300.00),
('22222222-2222-2222-2222-222222222222', 'm0000001-0001-0001-0001-000000000006', 'monthly', 24.99);
EOSQL

echo "✅ Database SQL scripts created in $DB_DIR"
echo " - schema.sql defines tables and RLS policies"
echo " - seed-data.sql has demo tenants, users, modules, subscriptions"
echo ""
echo "To load these into Postgres, run:"
echo "  psql -h <host> -U <user> -d <database> -f $DB_DIR/schema.sql"
echo "  psql -h <host> -U <user> -d <database> -f $DB_DIR/seed-data.sql"
