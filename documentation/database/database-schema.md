# Database Schema

## 📋 Database Overview

**Database Name**: `ekyc_platform`  
**Database Engine**: PostgreSQL 15  
**Character Encoding**: UTF-8  
**Collation**: C  
**Ctype**: C  
**Admin User**: `saas_user`  
**Admin Password**: `saas_password`

## 🎯 Purpose & Functionality

The KYC-Pro platform uses a **multi-schema PostgreSQL database** to support the microservices architecture. The database is organized into logical schemas that correspond to different business domains and service responsibilities.

### Key Features:
- **Multi-Schema Design**: Separate schemas for different business domains
- **Service Isolation**: Each service has its own schema and tables
- **Multi-Tenancy**: Tenant-based data isolation
- **Audit Trail**: Comprehensive logging and tracking
- **Performance Optimization**: Indexed and optimized for KYC workloads
- **Security**: Role-based access control and data encryption

## 🏗️ Schema Architecture

### Schema Organization

| Schema | Purpose | Service | Description |
|--------|---------|---------|-------------|
| `auth` | Authentication | Auth Service | User authentication and authorization |
| `core` | Core Business | All Services | Core business entities and relationships |
| `billing` | Billing & Subscriptions | Subscription Service | Billing, payments, and subscriptions |
| `registry` | Role Management | Registry Service | Roles, permissions, and access control |

### Schema Relationships
```
auth (Authentication)
├── users (User accounts and profiles)
└── sessions (User sessions and tokens)

core (Core Business)
├── tenants (Tenant organizations)
├── modules (Business modules)
├── user_modules (User-module assignments)
└── audit_logs (System audit trail)

billing (Billing & Subscriptions)
├── subscriptions (Tenant subscriptions)
├── payments (Payment transactions)
├── invoices (Billing invoices)
└── plans (Subscription plans)

registry (Role Management)
├── roles (System roles)
├── permissions (Role permissions)
├── user_roles (User-role assignments)
└── role_hierarchy (Role inheritance)
```

## 📊 Database Configuration

### PostgreSQL Configuration
```sql
-- Database Creation
CREATE DATABASE ekyc_platform
    WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TEMPLATE = template0;

-- User Creation
CREATE USER saas_user WITH PASSWORD 'saas_password';
GRANT ALL PRIVILEGES ON DATABASE ekyc_platform TO saas_user;
```

### Docker Configuration
```yaml
postgres:
  image: postgres:15
  container_name: ekyc-postgres
  environment:
    POSTGRES_DB: ekyc_platform
    POSTGRES_USER: saas_user
    POSTGRES_PASSWORD: saas_password
    POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
  ports:
    - "5432:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
    - ./database/init-keycloak-db.sql:/docker-entrypoint-initdb.d/1-init-keycloak-db.sql
    - ./database/schema.sql:/docker-entrypoint-initdb.d/2-schema.sql
    - ./database/seed-data.sql:/docker-entrypoint-initdb.d/3-seed-data.sql
```

## 🔐 Schema Details

### Auth Schema (`auth`)

#### Users Table
```sql
CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    date_of_birth VARCHAR(255),
    country VARCHAR(255),
    phone VARCHAR(255),
    role VARCHAR(255) NOT NULL,
    tenant_id UUID,
    status VARCHAR(255) NOT NULL DEFAULT 'active',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    keycloak_id VARCHAR(255)
);
```

**Indexes:**
```sql
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_tenant_id ON auth.users(tenant_id);
CREATE INDEX idx_users_role ON auth.users(role);
CREATE INDEX idx_users_status ON auth.users(status);
CREATE INDEX idx_users_keycloak_id ON auth.users(keycloak_id);
```

**Columns:**
- `id`: Unique user identifier (UUID)
- `email`: User email address (unique)
- `password_hash`: Encrypted password
- `first_name`: User's first name
- `last_name`: User's last name
- `date_of_birth`: User's date of birth
- `country`: User's country
- `phone`: User's phone number
- `role`: User role (platform_admin, platform_tenant_admin, platform_user)
- `tenant_id`: Associated tenant (for tenant users)
- `status`: User status (active, inactive, suspended)
- `last_login`: Last login timestamp
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp
- `keycloak_id`: Keycloak user ID for synchronization

### Core Schema (`core`)

#### Tenants Table
```sql
CREATE TABLE core.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    industry VARCHAR(100),
    country VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website VARCHAR(255),
    description TEXT,
    user_limit INTEGER DEFAULT 100,
    data_retention VARCHAR(50) DEFAULT '7_years',
    compliance_level VARCHAR(50) DEFAULT 'standard',
    custom_domain VARCHAR(255),
    sso_enabled BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'active',
    tenant_admin_id UUID,
    monthly_revenue DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### Modules Table
```sql
CREATE TABLE core.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    features JSONB,
    status VARCHAR(50) DEFAULT 'active',
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### User Modules Table
```sql
CREATE TABLE core.user_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    module_id UUID NOT NULL REFERENCES core.modules(id),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    UNIQUE(user_id, module_id, tenant_id)
);
```

### Billing Schema (`billing`)

#### Subscriptions Table
```sql
CREATE TABLE billing.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    plan_id VARCHAR(255) NOT NULL,
    modules JSONB NOT NULL,
    billing_cycle VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    last_billing_date TIMESTAMP WITH TIME ZONE,
    next_billing_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### Payments Table
```sql
CREATE TABLE billing.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES billing.subscriptions(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(100),
    transaction_id VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Registry Schema (`registry`)

#### Roles Table
```sql
CREATE TABLE registry.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(255) NOT NULL,
    role_code VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB,
    tenant_id UUID REFERENCES core.tenants(id),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_name, status),
    UNIQUE(role_code)
);
```

#### User Roles Table
```sql
CREATE TABLE registry.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    role_id UUID NOT NULL REFERENCES registry.roles(id),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES auth.users(id),
    status VARCHAR(50) DEFAULT 'active',
    UNIQUE(user_id, role_id, tenant_id)
);
```

## 🔧 Database Initialization

### Schema Creation Script
```sql
-- Database Initialization Script for Kyc-Pro Platform
-- Run this script before starting the services

-- Connect to the database
\c ekyc_platform;

-- Create all required schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS billing;
CREATE SCHEMA IF NOT EXISTS registry;

-- Grant permissions to the application user
GRANT USAGE ON SCHEMA auth TO saas_user;
GRANT USAGE ON SCHEMA core TO saas_user;
GRANT USAGE ON SCHEMA billing TO saas_user;
GRANT USAGE ON SCHEMA registry TO saas_user;

-- Grant all privileges on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON TABLES TO saas_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT ALL ON TABLES TO saas_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA billing GRANT ALL ON TABLES TO saas_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA registry GRANT ALL ON TABLES TO saas_user;

-- Grant all privileges on future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON SEQUENCES TO saas_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT ALL ON SEQUENCES TO saas_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA billing GRANT ALL ON SEQUENCES TO saas_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA registry GRANT ALL ON SEQUENCES TO saas_user;
```

## 🔄 Data Relationships

### Entity Relationship Diagram
```
auth.users (1) ──── (N) core.tenants
     │
     ├── (N) registry.user_roles (N) ──── registry.roles
     │
     └── (N) core.user_modules (N) ──── core.modules

core.tenants (1) ──── (N) billing.subscriptions
     │
     └── (1) ──── (N) registry.roles

billing.subscriptions (1) ──── (N) billing.payments
```

### Key Relationships
- **Users to Tenants**: Many users belong to one tenant
- **Users to Roles**: Many-to-many relationship through user_roles
- **Users to Modules**: Many-to-many relationship through user_modules
- **Tenants to Subscriptions**: One tenant can have multiple subscriptions
- **Subscriptions to Payments**: One subscription can have multiple payments

## 🔐 Security & Access Control

### User Permissions
```sql
-- Grant schema usage
GRANT USAGE ON SCHEMA auth TO saas_user;
GRANT USAGE ON SCHEMA core TO saas_user;
GRANT USAGE ON SCHEMA billing TO saas_user;
GRANT USAGE ON SCHEMA registry TO saas_user;

-- Grant table privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO saas_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA core TO saas_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA billing TO saas_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA registry TO saas_user;

-- Grant sequence privileges
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth TO saas_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA core TO saas_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA billing TO saas_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA registry TO saas_user;
```

### Multi-Tenancy Security
- **Tenant Isolation**: Data is isolated by tenant_id
- **Row-Level Security**: Implemented through application logic
- **Schema Separation**: Different schemas for different concerns
- **Audit Logging**: All changes are logged with user context

## 📈 Performance Optimization

### Indexing Strategy
```sql
-- User table indexes
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_tenant_id ON auth.users(tenant_id);
CREATE INDEX idx_users_role ON auth.users(role);
CREATE INDEX idx_users_status ON auth.users(status);

-- Tenant table indexes
CREATE INDEX idx_tenants_status ON core.tenants(status);
CREATE INDEX idx_tenants_country ON core.tenants(country);
CREATE INDEX idx_tenants_industry ON core.tenants(industry);

-- Subscription table indexes
CREATE INDEX idx_subscriptions_tenant_id ON billing.subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_status ON billing.subscriptions(status);
CREATE INDEX idx_subscriptions_billing_date ON billing.subscriptions(next_billing_date);

-- Role table indexes
CREATE INDEX idx_roles_tenant_id ON registry.roles(tenant_id);
CREATE INDEX idx_roles_status ON registry.roles(status);
```

### Query Optimization
- **Composite Indexes**: For frequently combined WHERE clauses
- **Partial Indexes**: For active records only
- **Covering Indexes**: Include frequently selected columns
- **Partitioning**: For large tables (future consideration)

## 🔍 Monitoring & Maintenance

### Health Checks
```sql
-- Database health check
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname IN ('auth', 'core', 'billing', 'registry')
ORDER BY schemaname, tablename, attname;

-- Table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname IN ('auth', 'core', 'billing', 'registry')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Backup Strategy
```bash
# Full database backup
pg_dump -h localhost -U saas_user -d ekyc_platform > backup_$(date +%Y%m%d_%H%M%S).sql

# Schema-specific backup
pg_dump -h localhost -U saas_user -d ekyc_platform -n auth > auth_backup.sql
pg_dump -h localhost -U saas_user -d ekyc_platform -n core > core_backup.sql
pg_dump -h localhost -U saas_user -d ekyc_platform -n billing > billing_backup.sql
pg_dump -h localhost -U saas_user -d ekyc_platform -n registry > registry_backup.sql
```

## 🚀 Deployment

### Docker Deployment
```bash
# Start database with Docker Compose
cd backend
docker-compose up -d postgres

# Initialize database
docker exec -i ekyc-postgres psql -U saas_user -d ekyc_platform < init-database.sql
```

### Environment Variables
```bash
# Database Configuration
POSTGRES_DB=ekyc_platform
POSTGRES_USER=saas_user
POSTGRES_PASSWORD=saas_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Connection URL
DATABASE_URL=jdbc:postgresql://localhost:5432/ekyc_platform
DATABASE_USERNAME=saas_user
DATABASE_PASSWORD=saas_password
```

## 📚 Related Documentation

- [Database Migrations](./database-migrations.md) - Schema evolution and migrations
- [Keycloak Configuration](../infrastructure/keycloak-configuration.md) - Identity management setup
- [Auth Service](../backend/auth-service.md) - Authentication backend
- [User Service](../backend/user-service.md) - User management backend
- [Tenant Service](../backend/tenant-service.md) - Tenant management backend

---

*Last Updated: [Current Date]*  
*Database Version: 1.0.0* 