# Keycloak Configuration

## 📋 Keycloak Overview

**Keycloak Version**: 23.0  
**Database**: PostgreSQL 15  
**Admin User**: `admin`  
**Admin Password**: `admin123`  
**Realm**: `ekyc`  
**Client ID**: `ekyc-platform-client`  
**Port**: 8080

## 🎯 Purpose & Functionality

Keycloak serves as the **Identity and Access Management (IAM)** system for the KYC-Pro platform. It provides centralized authentication, authorization, and user management capabilities across all microservices and frontend applications.

### Key Features:
- **Single Sign-On (SSO)**: Unified authentication across all applications
- **Multi-Tenancy**: Tenant-specific user management and roles
- **OAuth 2.0 & OpenID Connect**: Standard authentication protocols
- **JWT Tokens**: Secure token-based authentication
- **User Federation**: Integration with external identity providers
- **Role-Based Access Control (RBAC)**: Fine-grained permission management
- **Audit Logging**: Comprehensive security event logging

## ⚙️ Configuration Details

### Docker Configuration
```yaml
keycloak:
  image: quay.io/keycloak/keycloak:23.0
  container_name: ekyc-keycloak
  environment:
    KEYCLOAK_ADMIN: ${KEYCLOAK_ADMIN:-admin}
    KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD:-admin123}
    KC_DB: ${KC_DB:-postgres}
    KC_DB_URL: ${KC_DB_URL:-jdbc:postgresql://postgres:5432/keycloak?currentSchema=public}
    KC_DB_USERNAME: ${KC_DB_USERNAME:-saas_user}
    KC_DB_PASSWORD: ${KC_DB_PASSWORD:-saas_password}
    KC_HOSTNAME_STRICT: ${KC_HOSTNAME_STRICT:-false}
    KC_HOSTNAME_STRICT_HTTPS: ${KC_HOSTNAME_STRICT_HTTPS:-false}
    KC_HTTP_ENABLED: ${KC_HTTP_ENABLED:-true}
    KC_HEALTH_ENABLED: ${KC_HEALTH_ENABLED:-true}
    KC_METRICS_ENABLED: ${KC_METRICS_ENABLED:-true}
    KC_LOG_LEVEL: ${KC_LOG_LEVEL:-INFO}
  ports:
    - "${KEYCLOAK_PORT:-8080}:8080"
  depends_on:
    postgres:
      condition: service_healthy
  networks:
    - ekyc-network
  restart: unless-stopped
  command: start-dev
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8080/health/ready"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 60s
```

### Environment Variables
```bash
# Keycloak Admin Settings
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin123

# Keycloak Database Settings
KC_DB=postgres
KC_DB_URL=jdbc:postgresql://postgres:5432/keycloak
KC_DB_USERNAME=saas_user
KC_DB_PASSWORD=saas_password

# Keycloak Server Settings
KC_HOSTNAME_STRICT=false
KC_HOSTNAME_STRICT_HTTPS=false
KC_HTTP_ENABLED=true
KC_HEALTH_ENABLED=true
KC_METRICS_ENABLED=true
KC_LOG_LEVEL=INFO

# Keycloak Application Settings
KEYCLOAK_AUTH_SERVER_URL=http://localhost:8080
KEYCLOAK_REALM=ekyc
KEYCLOAK_CLIENT_ID=ekyc-platform-client
KEYCLOAK_CLIENT_SECRET=your-ekyc-platform-client-secret
KEYCLOAK_PRINCIPAL_ATTRIBUTE=preferred_username
KEYCLOAK_PUBLIC_CLIENT=false
```

## 🏗️ Database Setup

### Keycloak Database Initialization
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

### Database Schema
Keycloak automatically creates its schema with the following main tables:
- `user_entity`: User accounts and profiles
- `user_role_mapping`: User-role assignments
- `role_entity`: Role definitions
- `group_entity`: Group definitions
- `client_entity`: OAuth client configurations
- `realm`: Realm configurations
- `user_session`: Active user sessions
- `client_session`: OAuth client sessions

## 🔐 Realm Configuration

### EKYC Realm Setup
```json
{
  "realm": "ekyc",
  "enabled": true,
  "displayName": "KYC-Pro Platform",
  "displayNameHtml": "<div class=\"kc-logo-text\"><span>KYC-Pro</span></div>",
  "attributes": {
    "tenantId": "platform"
  }
}
```

### Realm Settings
- **Realm Name**: `ekyc`
- **Display Name**: `KYC-Pro Platform`
- **Enabled**: `true`
- **Registration Allowed**: `false` (managed through application)
- **Email Verification**: `required`
- **Reset Password**: `enabled`
- **Remember Me**: `enabled`
- **Brute Force Detection**: `enabled`

## 👥 User Management

### User Roles
```json
{
  "roles": {
    "platform_admin": {
      "description": "Platform Administrator",
      "composite": false,
      "clientRole": false,
      "attributes": {}
    },
    "platform_tenant_admin": {
      "description": "Tenant Administrator",
      "composite": false,
      "clientRole": false,
      "attributes": {}
    },
    "platform_user": {
      "description": "Platform User",
      "composite": false,
      "clientRole": false,
      "attributes": {}
    }
  }
}
```

### User Groups
```json
{
  "groups": {
    "platform-admins": {
      "name": "Platform Administrators",
      "attributes": {
        "type": "platform"
      }
    },
    "tenant-admins": {
      "name": "Tenant Administrators",
      "attributes": {
        "type": "tenant"
      }
    },
    "users": {
      "name": "Platform Users",
      "attributes": {
        "type": "user"
      }
    }
  }
}
```

### User Attributes
```json
{
  "userAttributes": {
    "tenant_id": "UUID of associated tenant",
    "user_type": "platform_admin|platform_tenant_admin|platform_user",
    "phone": "User phone number",
    "country": "User country",
    "date_of_birth": "User date of birth",
    "last_login": "Last login timestamp",
    "created_at": "Account creation timestamp"
  }
}
```

## 🔑 OAuth Client Configuration

### Platform Client Setup
```json
{
  "clientId": "ekyc-platform-client",
  "enabled": true,
  "publicClient": false,
  "standardFlowEnabled": true,
  "implicitFlowEnabled": false,
  "directAccessGrantsEnabled": true,
  "serviceAccountsEnabled": true,
  "redirectUris": [
    "http://localhost:4200/*",
    "http://localhost:4201/*",
    "http://localhost:4202/*",
    "http://localhost:4203/*"
  ],
  "webOrigins": [
    "http://localhost:4200",
    "http://localhost:4201",
    "http://localhost:4202",
    "http://localhost:4203"
  ],
  "attributes": {
    "saml.assertion.signature": "false",
    "saml.force.post.binding": "false",
    "saml.multivalued.roles": "false",
    "saml.encrypt": "false",
    "saml.server.signature": "false",
    "saml.server.signature.keyinfo.ext": "false",
    "exclude.session.state.from.auth.response": "false",
    "saml_force_name_id_format": "false",
    "saml.client.signature": "false",
    "tls.client.certificate.bound.access.tokens": "false",
    "saml.authnstatement": "false",
    "display.on.consent.screen": "false",
    "saml.onetimeuse.condition": "false"
  }
}
```

### Client Scopes
```json
{
  "scopes": {
    "openid": "OpenID Connect",
    "profile": "User profile information",
    "email": "Email address",
    "roles": "User roles",
    "tenant": "Tenant information",
    "modules": "Module access permissions"
  }
}
```

## 🔄 Integration with Microservices

### Auth Service Integration
```yaml
# Auth Service Configuration
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8080/realms/ekyc
          jwk-set-uri: http://localhost:8080/realms/ekyc/protocol/openid-connect/certs

keycloak:
  auth-server-url: http://localhost:8080
  realm: ekyc
  resource: ekyc-platform-client
  credentials:
    secret: your-ekyc-platform-client-secret
  principal-attribute: preferred_username
  public-client: false
```

### User Service Integration
```yaml
# User Service Configuration
keycloak:
  admin:
    url: http://localhost:8080
    realm: master
    username: admin
    password: admin123
    client-id: admin-cli
    client-secret: your-admin-cli-secret
```

### Keycloak Sync Service
```yaml
# Keycloak Sync Service Configuration
keycloak:
  admin:
    url: http://localhost:8080
    realm: master
    username: admin
    password: admin123
    client-id: admin-cli
    client-secret: your-admin-cli-secret
  
  sync:
    enabled: true
    interval: 300000  # 5 minutes
    user-sync: true
    role-sync: true
    group-sync: true
```

## 🔐 Security Configuration

### Password Policy
```json
{
  "passwordPolicy": {
    "length": 8,
    "digits": 1,
    "lowercase": 1,
    "uppercase": 1,
    "specialChars": 1,
    "notUsername": true,
    "notEmail": true,
    "notFirstName": true,
    "notLastName": true
  }
}
```

### Session Configuration
```json
{
  "sessionConfig": {
    "ssoSessionIdleTimeout": 1800,  // 30 minutes
    "ssoSessionMaxLifespan": 36000, // 10 hours
    "ssoSessionIdleTimeoutRememberMe": 0,
    "ssoSessionMaxLifespanRememberMe": 0,
    "offlineSessionIdleTimeout": 2592000, // 30 days
    "offlineSessionMaxLifespan": 5184000, // 60 days
    "clientSessionIdle": 0,
    "clientSessionMax": 0,
    "clientOfflineSessionIdle": 0,
    "clientOfflineSessionMax": 0
  }
}
```

### Brute Force Protection
```json
{
  "bruteForceDetection": {
    "enabled": true,
    "permanentLockout": false,
    "maxLoginFailures": 5,
    "minimumQuickLoginWait": 60,
    "waitIncrement": 60,
    "quickLoginCheckMilliSeconds": 1000,
    "maxFailureWaitSeconds": 900,
    "failureResetTimeSeconds": 43200
  }
}
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
```bash
# Keycloak health check
curl -f http://localhost:8080/health/ready

# Keycloak metrics
curl http://localhost:8080/metrics

# Keycloak info
curl http://localhost:8080/health/info
```

### Logging Configuration
```yaml
# Keycloak logging
KC_LOG_LEVEL: INFO
KC_LOG_CONSOLE_OUTPUT: true
KC_LOG_CONSOLE_FORMAT: "%d{yyyy-MM-dd HH:mm:ss,SSS} %-5p [%c] (%t) %s%e%n"
KC_LOG_CONSOLE_COLOR: true
```

## 🔧 Administration

### Admin CLI Commands
```bash
# Start Keycloak in development mode
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin123 \
  quay.io/keycloak/keycloak:23.0 start-dev

# Create realm
kcadm.sh config credentials --server http://localhost:8080 --realm master --user admin --password admin123
kcadm.sh create realms -s realm=ekyc -s enabled=true

# Create client
kcadm.sh create clients -r ekyc -s clientId=ekyc-platform-client -s enabled=true

# Create roles
kcadm.sh create roles -r ekyc -s name=platform_admin -s description="Platform Administrator"
kcadm.sh create roles -r ekyc -s name=platform_tenant_admin -s description="Tenant Administrator"
kcadm.sh create roles -r ekyc -s name=platform_user -s description="Platform User"
```

### User Management Commands
```bash
# Create user
kcadm.sh create users -r ekyc -s username=admin -s email=admin@ekyc.com -s enabled=true

# Assign role to user
kcadm.sh add-roles -r ekyc --uusername admin --rolename platform_admin

# Get user info
kcadm.sh get users -r ekyc --query username=admin

# Update user
kcadm.sh update users/$(kcadm.sh get users -r ekyc --query username=admin --fields id --format csv --noquotes | tail -n +2) \
  -r ekyc -s firstName=Admin -s lastName=User
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Connection Issues
```bash
# Check if Keycloak is running
docker ps | grep keycloak

# Check Keycloak logs
docker logs ekyc-keycloak

# Test database connection
docker exec -it ekyc-postgres psql -U saas_user -d keycloak -c "\dt"
```

#### 2. Authentication Issues
```bash
# Check realm configuration
kcadm.sh get realms/ekyc

# Check client configuration
kcadm.sh get clients -r ekyc --query clientId=ekyc-platform-client

# Check user sessions
kcadm.sh get sessions -r ekyc
```

#### 3. Token Issues
```bash
# Test token endpoint
curl -X POST http://localhost:8080/realms/ekyc/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=ekyc-platform-client&username=admin&password=password"
```

## 📚 Related Documentation

- [Database Schema](./database-schema.md) - Main database schema
- [Auth Service](../backend/auth-service.md) - Authentication backend
- [Keycloak Sync Service](../backend/keycloak-sync-service.md) - Keycloak synchronization
- [User Service](../backend/user-service.md) - User management backend

---

*Last Updated: [Current Date]*  
*Keycloak Version: 23.0* 