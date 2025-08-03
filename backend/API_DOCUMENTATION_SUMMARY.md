# Kyc-Pro API Documentation Summary

## 📋 Quick Reference

### Service URLs Overview
| Service | Direct Port | Gateway Path | Discovery Path |
|---------|-------------|--------------|----------------|
| API Gateway | 9080 | - | - |
| Eureka Server | 8761 | `/eureka` | - |
| Auth Service | 9081 | `/api/auth` | `/auth-service` |
| User Service | 9082 | `/api/users` | `/user-service` |
| Tenant Service | 9083 | `/api/tenants` | `/tenant-service` |
| Module Service | 9084 | `/api/modules` | `/module-service` |
| Subscription Service | 9085 | `/api/subscriptions` | `/subscription-service` |
| Registry Service | 9086 | `/api/registry` | `/registry-service` |
| Keycloak Sync Service | 9087 | `/api/keycloak-sync` | `/keycloak-sync-service` |

## 🧪 Testing All Services

### Health Check Commands
```bash
# Gateway Health
curl http://localhost:9080/actuator/health

# All Services via Gateway
curl http://localhost:9080/api/auth/actuator/health
curl http://localhost:9080/api/users/actuator/health
curl http://localhost:9080/api/tenants/actuator/health
curl http://localhost:9080/api/modules/actuator/health
curl http://localhost:9080/api/subscriptions/actuator/health
curl http://localhost:9080/api/registry/actuator/health
curl http://localhost:9080/api/keycloak-sync/actuator/health

# Direct Service Access
curl http://localhost:9081/actuator/health
curl http://localhost:9082/actuator/health
curl http://localhost:9083/actuator/health
curl http://localhost:9084/actuator/health
curl http://localhost:9085/actuator/health
curl http://localhost:9086/actuator/health
curl http://localhost:9087/actuator/health

# Service Discovery
curl http://localhost:9080/auth-service/actuator/health
curl http://localhost:9080/user-service/actuator/health
curl http://localhost:9080/tenant-service/actuator/health
curl http://localhost:9080/module-service/actuator/health
curl http://localhost:9080/subscription-service/actuator/health
curl http://localhost:9080/registry-service/actuator/health
curl http://localhost:9080/keycloak-sync-service/actuator/health
```

## 📚 Postman Collection

### Environment Files
1. **Kyc-Pro Direct Access** (`Kyc-Pro-Direct-Access.postman_environment.json`)
   - Direct service URLs (localhost:9081-9087)
   - For development and debugging

2. **Kyc-Pro Gateway Access** (`Kyc-Pro-Gateway-Access.postman_environment.json`)
   - Gateway URLs (localhost:9080/api/{service})
   - For production and integration testing

### Collection Structure
The Postman collection includes:
- **Auth Service**: Signup, Login, Health Check
- **User Service**: CRUD operations, Health Check
- **Tenant Service**: CRUD operations, Health Check
- **Module Service**: CRUD operations, Health Check
- **Subscription Service**: CRUD operations, Health Check
- **Registry Service**: CRUD operations, Health Check
- **Keycloak Sync Service**: Sync operations, Health Check
- **API Gateway**: Health Check, Routes Info
- **Eureka Server**: Dashboard, Health Check

### Environment Variables
```json
{
  "eureka_server_url": "http://localhost:8761",
  "api_gateway_url": "http://localhost:9080",
  "auth_service_url": "http://localhost:9081", // or "http://localhost:9080/api/auth"
  "user_service_url": "http://localhost:9082", // or "http://localhost:9080/api/users"
  "tenant_service_url": "http://localhost:9083", // or "http://localhost:9080/api/tenants"
  "module_service_url": "http://localhost:9084", // or "http://localhost:9080/api/modules"
  "subscription_service_url": "http://localhost:9085", // or "http://localhost:9080/api/subscriptions"
  "registry_service_url": "http://localhost:9086", // or "http://localhost:9080/api/registry"
  "keycloak_sync_service_url": "http://localhost:9087", // or "http://localhost:9080/api/keycloak-sync"
  "auth_token": ""
}
```

## 🔧 Gateway Configuration

### Route Configuration
```java
// Auth Service routes
.route("auth", r -> r.path("/api/auth/**")
    .filters(f -> f.rewritePath("/api/auth/(?<segment>.*)", "/${segment}"))
    .uri("lb://auth-service"))

// User Service routes
.route("user-management", r -> r.path("/api/users/**")
    .filters(f -> f.rewritePath("/api/users/(?<segment>.*)", "/${segment}"))
    .uri("lb://user-service"))
```

### Path Rewriting
- **Input**: `/api/auth/actuator/health`
- **Output**: `/actuator/health`
- **Service**: `lb://auth-service`

## 📊 Monitoring & Health Checks

### Gateway Monitoring
- **Health**: `http://localhost:9080/actuator/health`
- **Routes**: `http://localhost:9080/actuator/gateway/routes`
- **Info**: `http://localhost:9080/actuator/info`

### Service Discovery
- **Eureka Dashboard**: `http://localhost:8761`
- **Registered Services**: `http://localhost:8761/eureka/apps`
- **Service Health**: All services show UP status

### Health Check Endpoints
All services expose health endpoints at:
- **Direct**: `http://localhost:{port}/actuator/health`
- **Gateway**: `http://localhost:9080/api/{service}/actuator/health`
- **Discovery**: `http://localhost:9080/{service-name}/actuator/health`

## 🚀 Usage Guidelines

### For Frontend Development
```javascript
// Use Gateway URLs
const API_BASE_URL = 'http://localhost:9080/api';

// Auth Service
const authAPI = `${API_BASE_URL}/auth`;
const loginURL = `${authAPI}/login`;
const signupURL = `${authAPI}/signup`;

// User Service
const userAPI = `${API_BASE_URL}/users`;
const usersURL = `${userAPI}`;
const userURL = (id) => `${userAPI}/${id}`;
```

### For Backend Integration
```java
// Use Service Discovery
@LoadBalanced
@RestTemplate
public RestTemplate restTemplate() {
    return new RestTemplate();
}

// Service URLs
String authServiceUrl = "http://auth-service/api/auth";
String userServiceUrl = "http://user-service/api/users";
```

### For Testing
```bash
# Test all services health
for service in auth users tenants modules subscriptions registry keycloak-sync; do
  echo "Testing $service service..."
  curl -s http://localhost:9080/api/$service/actuator/health | jq '.status'
done
```

## 📝 Documentation Files

1. **SERVICE_ENDPOINTS.md** - Comprehensive service documentation
2. **Kyc-Pro-Backend-API.postman_collection.json** - Complete API collection
3. **Kyc-Pro-Direct-Access.postman_environment.json** - Direct service access
4. **Kyc-Pro-Gateway-Access.postman_environment.json** - Gateway access
5. **POSTMAN_SETUP_GUIDE.md** - Postman setup instructions

## ✅ Verification Checklist

- [x] All services are running and healthy
- [x] Gateway routes are working correctly
- [x] Service discovery is functional
- [x] Postman collection is updated
- [x] Environment files are configured
- [x] Health checks are accessible
- [x] Path rewriting is working
- [x] Load balancing is enabled
- [x] CORS is configured
- [x] Security is properly set up

## 🎯 Next Steps

1. **Frontend Integration**: Update Angular apps to use gateway URLs
2. **Authentication**: Implement JWT token handling
3. **Error Handling**: Add proper error responses
4. **Logging**: Implement structured logging
5. **Monitoring**: Set up metrics collection
6. **Documentation**: Add API documentation with Swagger 