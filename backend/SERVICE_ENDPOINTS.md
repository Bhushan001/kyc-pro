# Kyc-Pro Service Endpoints Documentation

This document provides comprehensive information about all service endpoints, including direct access and gateway routing paths.

## 📋 Service Overview

| Service | Port | Direct URL | Gateway Path | Discovery Path |
|---------|------|------------|--------------|----------------|
| API Gateway | 9080 | http://localhost:9080 | - | - |
| Eureka Server | 8761 | http://localhost:8761 | http://localhost:9080/eureka | - |
| Auth Service | 9081 | http://localhost:9081 | http://localhost:9080/api/auth | http://localhost:9080/auth-service |
| User Service | 9082 | http://localhost:9082 | http://localhost:9080/api/users | http://localhost:9080/user-service |
| Tenant Service | 9083 | http://localhost:9083 | http://localhost:9080/api/tenants | http://localhost:9080/tenant-service |
| Module Service | 9084 | http://localhost:9084 | http://localhost:9080/api/modules | http://localhost:9080/module-service |
| Subscription Service | 9085 | http://localhost:9085 | http://localhost:9080/api/subscriptions | http://localhost:9080/subscription-service |
| Registry Service | 9086 | http://localhost:9086 | http://localhost:9080/api/registry | http://localhost:9080/registry-service |
| Keycloak Sync Service | 9087 | http://localhost:9087 | http://localhost:9080/api/keycloak-sync | http://localhost:9080/keycloak-sync-service |

## 🔧 API Gateway

### Direct Access
- **Health Check**: `http://localhost:9080/actuator/health`
- **Gateway Routes**: `http://localhost:9080/actuator/gateway/routes`
- **Health (Simplified)**: `http://localhost:9080/health`

### Gateway Configuration
- **Port**: 9080
- **Service Discovery**: Enabled
- **Load Balancing**: Enabled
- **CORS**: Configured
- **Security**: CSRF disabled, all routes permitted

## 🔍 Eureka Server

### Direct Access
- **Health Check**: `http://localhost:8761/actuator/health`
- **Service Registry**: `http://localhost:8761/eureka/apps`
- **Dashboard**: `http://localhost:8761`

### Gateway Access
- **Health Check**: `http://localhost:9080/eureka/actuator/health`
- **Service Registry**: `http://localhost:9080/eureka/eureka/apps`

## 🔐 Auth Service

### Direct Access
- **Base URL**: `http://localhost:9081`
- **Health Check**: `http://localhost:9081/actuator/health`
- **User Signup**: `http://localhost:9081/api/auth/signup`
- **User Login**: `http://localhost:9081/api/auth/login`
- **Token Validation**: `http://localhost:9081/api/auth/validate`

### Gateway Access
- **Base URL**: `http://localhost:9080/api/auth`
- **Health Check**: `http://localhost:9080/api/auth/actuator/health`
- **User Signup**: `http://localhost:9080/api/auth/signup`
- **User Login**: `http://localhost:9080/api/auth/login`
- **Token Validation**: `http://localhost:9080/api/auth/validate`

### Service Discovery
- **Base URL**: `http://localhost:9080/auth-service`
- **Health Check**: `http://localhost:9080/auth-service/actuator/health`

## 👥 User Service

### Direct Access
- **Base URL**: `http://localhost:9082`
- **Health Check**: `http://localhost:9082/actuator/health`
- **Create User**: `http://localhost:9082/api/users`
- **Get User**: `http://localhost:9082/api/users/{id}`
- **Update User**: `http://localhost:9082/api/users/{id}`
- **Delete User**: `http://localhost:9082/api/users/{id}`
- **Get All Users**: `http://localhost:9082/api/users`

### Gateway Access
- **Base URL**: `http://localhost:9080/api/users`
- **Health Check**: `http://localhost:9080/api/users/actuator/health`
- **Create User**: `http://localhost:9080/api/users`
- **Get User**: `http://localhost:9080/api/users/{id}`
- **Update User**: `http://localhost:9080/api/users/{id}`
- **Delete User**: `http://localhost:9080/api/users/{id}`
- **Get All Users**: `http://localhost:9080/api/users`

### Service Discovery
- **Base URL**: `http://localhost:9080/user-service`
- **Health Check**: `http://localhost:9080/user-service/actuator/health`

## 🏢 Tenant Service

### Direct Access
- **Base URL**: `http://localhost:9083`
- **Health Check**: `http://localhost:9083/actuator/health`
- **Create Tenant**: `http://localhost:9083/api/tenants`
- **Get Tenant**: `http://localhost:9083/api/tenants/{id}`
- **Update Tenant**: `http://localhost:9083/api/tenants/{id}`
- **Delete Tenant**: `http://localhost:9083/api/tenants/{id}`
- **Get All Tenants**: `http://localhost:9083/api/tenants`

### Gateway Access
- **Base URL**: `http://localhost:9080/api/tenants`
- **Health Check**: `http://localhost:9080/api/tenants/actuator/health`
- **Create Tenant**: `http://localhost:9080/api/tenants`
- **Get Tenant**: `http://localhost:9080/api/tenants/{id}`
- **Update Tenant**: `http://localhost:9080/api/tenants/{id}`
- **Delete Tenant**: `http://localhost:9080/api/tenants/{id}`
- **Get All Tenants**: `http://localhost:9080/api/tenants`

### Service Discovery
- **Base URL**: `http://localhost:9080/tenant-service`
- **Health Check**: `http://localhost:9080/tenant-service/actuator/health`

## 📦 Module Service

### Direct Access
- **Base URL**: `http://localhost:9084`
- **Health Check**: `http://localhost:9084/actuator/health`
- **Create Module**: `http://localhost:9084/api/modules`
- **Get Module**: `http://localhost:9084/api/modules/{id}`
- **Update Module**: `http://localhost:9084/api/modules/{id}`
- **Delete Module**: `http://localhost:9084/api/modules/{id}`
- **Get All Modules**: `http://localhost:9084/api/modules`

### Gateway Access
- **Base URL**: `http://localhost:9080/api/modules`
- **Health Check**: `http://localhost:9080/api/modules/actuator/health`
- **Create Module**: `http://localhost:9080/api/modules`
- **Get Module**: `http://localhost:9080/api/modules/{id}`
- **Update Module**: `http://localhost:9080/api/modules/{id}`
- **Delete Module**: `http://localhost:9080/api/modules/{id}`
- **Get All Modules**: `http://localhost:9080/api/modules`

### Service Discovery
- **Base URL**: `http://localhost:9080/module-service`
- **Health Check**: `http://localhost:9080/module-service/actuator/health`

## 💳 Subscription Service

### Direct Access
- **Base URL**: `http://localhost:9085`
- **Health Check**: `http://localhost:9085/actuator/health`
- **Create Subscription**: `http://localhost:9085/api/subscriptions`
- **Get Subscription**: `http://localhost:9085/api/subscriptions/{id}`
- **Update Subscription**: `http://localhost:9085/api/subscriptions/{id}`
- **Delete Subscription**: `http://localhost:9085/api/subscriptions/{id}`
- **Get All Subscriptions**: `http://localhost:9085/api/subscriptions`

### Gateway Access
- **Base URL**: `http://localhost:9080/api/subscriptions`
- **Health Check**: `http://localhost:9080/api/subscriptions/actuator/health`
- **Create Subscription**: `http://localhost:9080/api/subscriptions`
- **Get Subscription**: `http://localhost:9080/api/subscriptions/{id}`
- **Update Subscription**: `http://localhost:9080/api/subscriptions/{id}`
- **Delete Subscription**: `http://localhost:9080/api/subscriptions/{id}`
- **Get All Subscriptions**: `http://localhost:9080/api/subscriptions`

### Service Discovery
- **Base URL**: `http://localhost:9080/subscription-service`
- **Health Check**: `http://localhost:9080/subscription-service/actuator/health`

## 📋 Registry Service

### Direct Access
- **Base URL**: `http://localhost:9086`
- **Health Check**: `http://localhost:9086/actuator/health`
- **Create Registry**: `http://localhost:9086/api/registry`
- **Get Registry**: `http://localhost:9086/api/registry/{id}`
- **Update Registry**: `http://localhost:9086/api/registry/{id}`
- **Delete Registry**: `http://localhost:9086/api/registry/{id}`
- **Get All Registry**: `http://localhost:9086/api/registry`

### Gateway Access
- **Base URL**: `http://localhost:9080/api/registry`
- **Health Check**: `http://localhost:9080/api/registry/actuator/health`
- **Create Registry**: `http://localhost:9080/api/registry`
- **Get Registry**: `http://localhost:9080/api/registry/{id}`
- **Update Registry**: `http://localhost:9080/api/registry/{id}`
- **Delete Registry**: `http://localhost:9080/api/registry/{id}`
- **Get All Registry**: `http://localhost:9080/api/registry`

### Service Discovery
- **Base URL**: `http://localhost:9080/registry-service`
- **Health Check**: `http://localhost:9080/registry-service/actuator/health`

## 🔄 Keycloak Sync Service

### Direct Access
- **Base URL**: `http://localhost:9087`
- **Health Check**: `http://localhost:9087/actuator/health`
- **Sync Users**: `http://localhost:9087/api/keycloak-sync/users`
- **Sync Roles**: `http://localhost:9087/api/keycloak-sync/roles`
- **Sync Groups**: `http://localhost:9087/api/keycloak-sync/groups`

### Gateway Access
- **Base URL**: `http://localhost:9080/api/keycloak-sync`
- **Health Check**: `http://localhost:9080/api/keycloak-sync/actuator/health`
- **Sync Users**: `http://localhost:9080/api/keycloak-sync/users`
- **Sync Roles**: `http://localhost:9080/api/keycloak-sync/roles`
- **Sync Groups**: `http://localhost:9080/api/keycloak-sync/groups`

### Service Discovery
- **Base URL**: `http://localhost:9080/keycloak-sync-service`
- **Health Check**: `http://localhost:9080/keycloak-sync-service/actuator/health`

## 🧪 Testing Endpoints

### Health Check Commands
```bash
# Gateway Health
curl http://localhost:9080/actuator/health

# All Services Health via Gateway
curl http://localhost:9080/api/auth/actuator/health
curl http://localhost:9080/api/users/actuator/health
curl http://localhost:9080/api/tenants/actuator/health
curl http://localhost:9080/api/modules/actuator/health
curl http://localhost:9080/api/subscriptions/actuator/health
curl http://localhost:9080/api/registry/actuator/health
curl http://localhost:9080/api/keycloak-sync/actuator/health

# Direct Service Health
curl http://localhost:9081/actuator/health
curl http://localhost:9082/actuator/health
curl http://localhost:9083/actuator/health
curl http://localhost:9084/actuator/health
curl http://localhost:9085/actuator/health
curl http://localhost:9086/actuator/health
curl http://localhost:9087/actuator/health
```

## 📊 Service Discovery

### Eureka Dashboard
- **URL**: http://localhost:8761
- **Registered Services**: All services are automatically registered
- **Health Status**: All services show UP status

### Gateway Routes
- **Routes Info**: http://localhost:9080/actuator/gateway/routes
- **Service Discovery**: Enabled with automatic route generation

## 🔧 Configuration Notes

### Gateway Configuration
- **Service Discovery**: Enabled
- **Load Balancing**: Round-robin
- **Path Rewriting**: `/api/{service}/(?<segment>.*)` → `/${segment}`
- **CORS**: Configured for cross-origin requests
- **Security**: CSRF disabled, all routes permitted

### Service Registration
- **Auto Registration**: All services register with Eureka automatically
- **Health Checks**: All services expose health endpoints
- **Metadata**: Service metadata includes management port information

## 🚀 Usage Guidelines

### For Frontend Applications
- **Use Gateway URLs**: Always use gateway URLs for production
- **Base URL**: `http://localhost:9080/api/{service}`
- **Health Checks**: Use `/actuator/health` for monitoring

### For Direct Service Access
- **Development**: Use direct URLs for debugging
- **Base URL**: `http://localhost:{port}`
- **Health Checks**: Use `/actuator/health` for monitoring

### For Service Discovery
- **Dynamic Discovery**: Use service discovery URLs
- **Base URL**: `http://localhost:9080/{service-name}`
- **Load Balancing**: Automatic load balancing across instances 