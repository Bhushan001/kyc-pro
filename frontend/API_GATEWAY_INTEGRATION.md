# API Gateway Integration for Frontend Portals

## Overview

All 4 frontend portals (KYC-Pro, Hub, Console, Workspace) now communicate with backend services through the API Gateway at `http://localhost:8080/api` (development) or `https://api.kyc-pro.com/api` (production).

## Service Prefixes

The API Gateway routes requests to the appropriate microservices using the following prefixes:

| Service | Prefix | Backend Service | Port |
|---------|--------|----------------|------|
| Authentication | `/auth` | auth-service | 8081 |
| Tenant Management | `/tenants` | tenant-service | 8082 |
| User Management | `/users` | user-service | 8083 |
| Module Management | `/modules` | module-service | 8084 |
| Subscription Management | `/subscriptions` | subscription-service | 8085 |

## Environment Configuration

Each portal has environment-specific configurations:

### Development Environment (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiGatewayUrl: 'http://localhost:8080/api',
  services: {
    auth: '/auth',
    tenant: '/tenants',
    user: '/users',
    module: '/modules',
    subscription: '/subscriptions'
  }
};
```

### Production Environment (`environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiGatewayUrl: 'https://api.kyc-pro.com/api',
  services: {
    auth: '/auth',
    tenant: '/tenants',
    user: '/users',
    module: '/modules',
    subscription: '/subscriptions'
  }
};
```

## Portal-Specific Service Updates

### 1. KYC-Pro Portal (`frontend/kyc-pro/`)
**Purpose**: Landing page and authentication
**Updated Service**: `auth.service.ts`
- Uses `${environment.apiGatewayUrl}${environment.services.auth}`
- Endpoints: `/login`, `/signup`, `/refresh`, `/logout`

### 2. Hub Portal (`frontend/hub-portal/`)
**Purpose**: Platform admin interface
**Updated Service**: `api.service.ts`
- Uses `${environment.apiGatewayUrl}`
- Endpoints: `/tenants`, `/modules`, `/users`, `/subscriptions`

### 3. Console Portal (`frontend/console-portal/`)
**Purpose**: Tenant admin interface
**Updated Service**: `tenant-api.service.ts`
- Uses `${environment.apiGatewayUrl}`
- Endpoints: `/users/tenant/{tenantId}`, `/subscriptions/tenant/{tenantId}`

### 4. Workspace Portal (`frontend/workspace-portal/`)
**Purpose**: User workspace interface
**Updated Service**: `api.service.ts`
- Uses `${environment.apiGatewayUrl}`
- Endpoints: `/users/tasks`, `/modules`

## Shared API Configuration

A shared API configuration file (`frontend/shared/api-config.ts`) provides centralized endpoint definitions:

```typescript
export class ApiConfig {
  // Service endpoints
  static readonly AUTH_SERVICE = `${environment.apiGatewayUrl}${environment.services.auth}`;
  static readonly TENANT_SERVICE = `${environment.apiGatewayUrl}${environment.services.tenant}`;
  static readonly USER_SERVICE = `${environment.apiGatewayUrl}${environment.services.user}`;
  static readonly MODULE_SERVICE = `${environment.apiGatewayUrl}${environment.services.module}`;
  static readonly SUBSCRIPTION_SERVICE = `${environment.apiGatewayUrl}${environment.services.subscription}`;
  
  // Specific endpoints
  static readonly LOGIN = `${ApiConfig.AUTH_SERVICE}/login`;
  static readonly GET_TENANTS = `${ApiConfig.TENANT_SERVICE}`;
  static readonly GET_USERS_BY_TENANT = (tenantId: string) => `${ApiConfig.USER_SERVICE}/tenant/${tenantId}`;
  // ... more endpoints
}
```

## API Gateway Routes

The backend API Gateway (`backend/api-gateway/`) routes requests as follows:

```yaml
routes:
  - id: auth
    uri: lb://auth-service
    predicates: [ Path=/api/auth/** ]
  - id: tenant
    uri: lb://tenant-service
    predicates: [ Path=/api/tenants/** ]
  - id: user
    uri: lb://user-service
    predicates: [ Path=/api/users/** ]
  - id: module
    uri: lb://module-service
    predicates: [ Path=/api/modules/** ]
  - id: subscription
    uri: lb://subscription-service
    predicates: [ Path=/api/subscriptions/** ]
```

## Benefits of This Architecture

✅ **Centralized Routing**: All requests go through API Gateway  
✅ **Service Discovery**: Automatic service discovery via Eureka  
✅ **Load Balancing**: Built-in load balancing across service instances  
✅ **Environment Flexibility**: Easy switching between dev/prod environments  
✅ **Consistent Endpoints**: Standardized service prefixes across all portals  
✅ **Security**: Centralized authentication and authorization  
✅ **Monitoring**: Centralized logging and monitoring  

## Usage Examples

### Authentication (KYC-Pro Portal)
```typescript
// Login
POST http://localhost:8080/api/auth/login

// Signup
POST http://localhost:8080/api/auth/signup
```

### Tenant Management (Hub Portal)
```typescript
// Get all tenants
GET http://localhost:8080/api/tenants

// Get specific tenant
GET http://localhost:8080/api/tenants/{id}
```

### User Management (Console Portal)
```typescript
// Get users by tenant
GET http://localhost:8080/api/users/tenant/{tenantId}

// Get subscriptions by tenant
GET http://localhost:8080/api/subscriptions/tenant/{tenantId}
```

### Module Management (Workspace Portal)
```typescript
// Get all modules
GET http://localhost:8080/api/modules

// Get user tasks
GET http://localhost:8080/api/users/{userId}/tasks
```

## Development Setup

1. **Start Backend Services**:
   ```bash
   cd backend
   docker-compose up -d
   ./build_all.sh
   ```

2. **Start Frontend Portals**:
   ```bash
   # KYC-Pro Portal
   cd frontend/kyc-pro && npm start
   
   # Hub Portal
   cd frontend/hub-portal && npm start
   
   # Console Portal
   cd frontend/console-portal && npm start
   
   # Workspace Portal
   cd frontend/workspace-portal && npm start
   ```

3. **Verify API Gateway**:
   - API Gateway: http://localhost:8080
   - Eureka Server: http://localhost:8761

## Production Deployment

For production deployment, update the `environment.prod.ts` files in each portal with the correct production API Gateway URL and ensure all backend services are properly deployed and registered with the Eureka server. 