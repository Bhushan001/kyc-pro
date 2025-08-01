-- Enable UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA auth;
CREATE SCHEMA core;
CREATE SCHEMA billing;

-- Tenants
CREATE TABLE core.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  domain      VARCHAR(255) UNIQUE NOT NULL,
  plan        VARCHAR(50)  NOT NULL DEFAULT 'basic',
  status      VARCHAR(50)  NOT NULL DEFAULT 'active',
  created_at  TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  role          VARCHAR(50)  NOT NULL,
  tenant_id     UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  status        VARCHAR(50)  DEFAULT 'active',
  created_at    TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
);

-- Modules
CREATE TABLE core.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) UNIQUE NOT NULL,
  category      VARCHAR(100) NOT NULL,
  monthly_price DECIMAL(10,2) NOT NULL,
  yearly_price  DECIMAL(10,2) NOT NULL
);

-- Subscriptions
CREATE TABLE billing.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES core.tenants(id) ON DELETE CASCADE,
  module_id UUID REFERENCES core.modules(id) ON DELETE CASCADE,
  billing_cycle VARCHAR(20) DEFAULT 'monthly',
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  subscribed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
