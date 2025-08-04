# Database Migrations

## 📋 Migration Overview

**Migration System**: Manual SQL Scripts  
**Database Engine**: PostgreSQL 15  
**Migration Location**: `backend/database/`  
**Version Control**: Git-based migration tracking  
**Rollback Strategy**: Manual rollback scripts

## 🎯 Purpose & Functionality

The KYC-Pro platform uses **manual SQL migration scripts** to manage database schema evolution. This approach provides full control over database changes and ensures consistency across different environments.

### Key Features:
- **Version Control**: All migrations tracked in Git
- **Environment Consistency**: Same scripts across dev, staging, prod
- **Rollback Support**: Manual rollback procedures
- **Schema Validation**: Migration verification scripts
- **Data Preservation**: Safe data migration strategies
- **Multi-Schema Support**: Migrations across all schemas

## 📁 Migration Scripts

### Core Migration Scripts

#### 1. Database Initialization (`init-database.sql`)
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

#### 2. Keycloak Database Setup (`init-keycloak-db.sql`)
```sql
-- Keycloak Database Initialization
-- This script creates the Keycloak database and user

-- Create Keycloak database
CREATE DATABASE keycloak;

-- Grant privileges to saas_user for Keycloak database
GRANT ALL PRIVILEGES ON DATABASE keycloak TO saas_user;

-- Connect to keycloak database and create extensions
\c keycloak;

-- Create required extensions for Keycloak
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant schema privileges
GRANT USAGE ON SCHEMA public TO saas_user;
GRANT CREATE ON SCHEMA public TO saas_user;
```

### Schema Migration Scripts

#### 3. User Table Fix (`fix-user-table-columns.sql`)
```sql
-- Fix User Table Column Names
-- This script updates the column names to match the auth-service entity

-- Connect to the main database
\c ekyc_platform;

-- Rename columns to match the auth-service entity
ALTER TABLE auth.users RENAME COLUMN first_name TO firstname;
ALTER TABLE auth.users RENAME COLUMN last_name TO lastname;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'auth' AND table_name = 'users' 
ORDER BY ordinal_position;

-- Show the updated table structure
\d auth.users;
```

#### 4. User Table Recreation (`drop-recreate-user-tables.sql`)
```sql
-- Drop and Recreate User Service Tables
-- This script drops existing user tables and recreates them

-- Connect to the main database
\c ekyc_platform;

-- Drop existing tables in auth schema (if they exist)
DROP TABLE IF EXISTS auth.users CASCADE;

-- Drop the auth schema if it exists and recreate it
DROP SCHEMA IF EXISTS auth CASCADE;
CREATE SCHEMA auth;

-- Grant privileges on auth schema
GRANT USAGE ON SCHEMA auth TO saas_user;
GRANT CREATE ON SCHEMA auth TO saas_user;

-- Create the users table
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

-- Create indexes for better performance
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_tenant_id ON auth.users(tenant_id);
CREATE INDEX idx_users_role ON auth.users(role);
CREATE INDEX idx_users_status ON auth.users(status);
CREATE INDEX idx_users_keycloak_id ON auth.users(keycloak_id);

-- Grant privileges on the users table
GRANT ALL PRIVILEGES ON TABLE auth.users TO saas_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth TO saas_user;
```

#### 5. Registry Constraints Reset (`reset-registry-constraints.sql`)
```sql
-- Manual database reset script for registry service constraints
-- Run this script manually if the registry service fails to start

-- Connect to the database and run these commands:

-- Drop all constraints on the roles table
ALTER TABLE registry.roles DROP CONSTRAINT IF EXISTS roles_role_name_key;
ALTER TABLE registry.roles DROP CONSTRAINT IF EXISTS roles_role_code_key;
ALTER TABLE registry.roles DROP CONSTRAINT IF EXISTS unique_role_name_status;
ALTER TABLE registry.roles DROP CONSTRAINT IF EXISTS unique_role_code;

-- Recreate the constraints properly
ALTER TABLE registry.roles ADD CONSTRAINT IF NOT EXISTS unique_role_name_status UNIQUE (role_name, status);
ALTER TABLE registry.roles ADD CONSTRAINT IF NOT EXISTS unique_role_code UNIQUE (role_code);

-- Verify the constraints
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'roles' AND table_schema = 'registry';
```

## 🔄 Migration Workflow

### Migration Process

#### 1. Development Environment
```bash
# 1. Create migration script
touch backend/database/migration-001-add-new-table.sql

# 2. Write migration SQL
# 3. Test migration locally
psql -h localhost -U saas_user -d ekyc_platform -f backend/database/migration-001-add-new-table.sql

# 4. Verify migration
psql -h localhost -U saas_user -d ekyc_platform -c "\dt auth.*"
```

#### 2. Staging Environment
```bash
# 1. Backup current database
pg_dump -h staging-db -U saas_user -d ekyc_platform > staging_backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Apply migration
psql -h staging-db -U saas_user -d ekyc_platform -f backend/database/migration-001-add-new-table.sql

# 3. Verify application functionality
# 4. Run integration tests
```

#### 3. Production Environment
```bash
# 1. Schedule maintenance window
# 2. Create production backup
pg_dump -h prod-db -U saas_user -d ekyc_platform > prod_backup_$(date +%Y%m%d_%H%M%S).sql

# 3. Apply migration
psql -h prod-db -U saas_user -d ekyc_platform -f backend/database/migration-001-add-new-table.sql

# 4. Verify production functionality
# 5. Monitor application health
```

### Migration Naming Convention
```
migration-{version}-{description}.sql

Examples:
- migration-001-add-user-table.sql
- migration-002-add-tenant-indexes.sql
- migration-003-update-user-constraints.sql
- migration-004-add-billing-schema.sql
```

## 🔧 Migration Best Practices

### 1. Migration Script Structure
```sql
-- Migration: 001-add-user-table
-- Description: Add users table to auth schema
-- Author: Development Team
-- Date: 2024-01-15
-- Rollback: migration-001-rollback.sql

-- Begin transaction
BEGIN;

-- Add new table
CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    -- ... other columns
);

-- Add indexes
CREATE INDEX idx_users_email ON auth.users(email);

-- Add constraints
ALTER TABLE auth.users ADD CONSTRAINT chk_user_status 
    CHECK (status IN ('active', 'inactive', 'suspended'));

-- Commit transaction
COMMIT;

-- Verify migration
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'auth' AND table_name = 'users';
```

### 2. Rollback Script Structure
```sql
-- Rollback: 001-add-user-table
-- Description: Remove users table from auth schema
-- Author: Development Team
-- Date: 2024-01-15

-- Begin transaction
BEGIN;

-- Drop table (cascade to remove dependencies)
DROP TABLE IF EXISTS auth.users CASCADE;

-- Commit transaction
COMMIT;

-- Verify rollback
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'auth' AND table_name = 'users';
```

### 3. Data Migration Scripts
```sql
-- Data Migration: Update user roles
-- Description: Update existing user roles to new format

-- Begin transaction
BEGIN;

-- Update existing data
UPDATE auth.users 
SET role = CASE 
    WHEN role = 'admin' THEN 'platform_admin'
    WHEN role = 'tenant_admin' THEN 'platform_tenant_admin'
    WHEN role = 'user' THEN 'platform_user'
    ELSE role
END
WHERE role IN ('admin', 'tenant_admin', 'user');

-- Verify data migration
SELECT role, COUNT(*) as count 
FROM auth.users 
GROUP BY role;

-- Commit transaction
COMMIT;
```

## 🔍 Migration Validation

### 1. Schema Validation
```sql
-- Validate schema structure
SELECT 
    table_schema,
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema IN ('auth', 'core', 'billing', 'registry')
ORDER BY table_schema, table_name, ordinal_position;
```

### 2. Constraint Validation
```sql
-- Validate constraints
SELECT 
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema IN ('auth', 'core', 'billing', 'registry')
ORDER BY tc.table_schema, tc.table_name, tc.constraint_name;
```

### 3. Index Validation
```sql
-- Validate indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname IN ('auth', 'core', 'billing', 'registry')
ORDER BY schemaname, tablename, indexname;
```

## 🚨 Troubleshooting

### Common Migration Issues

#### 1. Constraint Conflicts
```sql
-- Check for constraint conflicts
SELECT 
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_schema IN ('auth', 'core', 'billing', 'registry')
    AND tc.constraint_type = 'UNIQUE';

-- Drop conflicting constraints
ALTER TABLE registry.roles DROP CONSTRAINT IF EXISTS unique_role_name_status;
ALTER TABLE registry.roles DROP CONSTRAINT IF EXISTS unique_role_code;

-- Recreate constraints
ALTER TABLE registry.roles ADD CONSTRAINT unique_role_name_status UNIQUE (role_name, status);
ALTER TABLE registry.roles ADD CONSTRAINT unique_role_code UNIQUE (role_code);
```

#### 2. Column Name Conflicts
```sql
-- Check column names
SELECT 
    table_schema,
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'auth' 
    AND table_name = 'users'
    AND column_name IN ('first_name', 'firstname', 'last_name', 'lastname');

-- Rename columns if needed
ALTER TABLE auth.users RENAME COLUMN first_name TO firstname;
ALTER TABLE auth.users RENAME COLUMN last_name TO lastname;
```

#### 3. Permission Issues
```sql
-- Check user permissions
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.table_privileges 
WHERE table_schema IN ('auth', 'core', 'billing', 'registry')
    AND grantee = 'saas_user';

-- Grant missing permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO saas_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA core TO saas_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA billing TO saas_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA registry TO saas_user;
```

## 📊 Migration Monitoring

### 1. Migration Log
```sql
-- Create migration log table
CREATE TABLE IF NOT EXISTS core.migration_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    migration_name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    applied_by VARCHAR(255),
    status VARCHAR(50) DEFAULT 'success',
    execution_time_ms INTEGER,
    error_message TEXT
);

-- Log migration execution
INSERT INTO core.migration_log (migration_name, applied_by, execution_time_ms)
VALUES ('migration-001-add-user-table', 'saas_user', 1500);
```

### 2. Schema Version Tracking
```sql
-- Create schema version table
CREATE TABLE IF NOT EXISTS core.schema_version (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(50) NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Track schema version
INSERT INTO core.schema_version (version, description)
VALUES ('1.0.0', 'Initial schema setup');
```

## 🔄 Rollback Procedures

### 1. Full Database Rollback
```bash
# Restore from backup
psql -h localhost -U saas_user -d ekyc_platform < backup_20240115_143022.sql

# Verify restoration
psql -h localhost -U saas_user -d ekyc_platform -c "\dt auth.*"
```

### 2. Schema-Specific Rollback
```bash
# Restore specific schema
pg_restore -h localhost -U saas_user -d ekyc_platform -n auth auth_backup.sql

# Verify schema restoration
psql -h localhost -U saas_user -d ekyc_platform -c "\dt auth.*"
```

### 3. Table-Specific Rollback
```sql
-- Drop and recreate specific table
DROP TABLE IF EXISTS auth.users CASCADE;

-- Restore table from backup
\i auth_users_backup.sql

-- Verify table restoration
SELECT * FROM auth.users LIMIT 5;
```

## 📚 Related Documentation

- [Database Schema](./database-schema.md) - Complete database schema documentation
- [Keycloak Configuration](../infrastructure/keycloak-configuration.md) - Identity management setup
- [Auth Service](../backend/auth-service.md) - Authentication backend
- [User Service](../backend/user-service.md) - User management backend

---

*Last Updated: [Current Date]*  
*Migration System Version: 1.0.0* 