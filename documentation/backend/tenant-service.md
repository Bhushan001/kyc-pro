# Tenant Service

## 📋 Service Overview

**Service Name**: Tenant Service  
**Port**: 9083  
**Application Name**: `tenant-service`  
**Health Check**: http://localhost:9083/actuator/health  
**Base URL**: http://localhost:9083/api/tenants

## 🎯 Purpose & Functionality

The Tenant Service is responsible for **multi-tenant management** in the KYC-Pro platform. It handles tenant creation, configuration, isolation, and lifecycle management for the multi-tenant architecture.

### Key Responsibilities:
- **Tenant CRUD Operations**: Create, read, update, delete tenant organizations
- **Tenant Configuration**: Manage tenant-specific settings and configurations
- **Tenant Isolation**: Ensure data isolation between tenants
- **Tenant Lifecycle**: Handle tenant activation, suspension, and deletion
- **Tenant Admin Management**: Manage tenant administrator assignments
- **Tenant Analytics**: Track tenant usage and performance metrics
- **Billing Integration**: Interface with subscription and billing services

## ⚙️ Configuration Details

### Server Configuration
```yaml
server:
  port: 9083
```

### Spring Application Configuration
```yaml
spring:
  application:
    name: tenant-service
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/ekyc_platform}
    username: ${DATABASE_USERNAME:saas_user}
    password: ${DATABASE_PASSWORD:saas_password}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    defer-datasource-initialization: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
```

### Eureka Configuration
```yaml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true
    instance-id: ${spring.application.name}:${server.port}
```

### Management Endpoints
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info
```

### Logging Configuration
```yaml
logging:
  level:
    com.ekyc.tenantservice: DEBUG
```

## 🔌 API Endpoints

### Tenant Management Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/tenants` | Get all tenants | - | `List<Tenant>` |
| `GET` | `/api/tenants/{id}` | Get tenant by ID | - | `Tenant` |
| `POST` | `/api/tenants` | Create new tenant | `TenantRequest` | `Tenant` |
| `PUT` | `/api/tenants/{id}` | Update tenant | `TenantRequest` | `Tenant` |
| `DELETE` | `/api/tenants/{id}` | Delete tenant | - | `void` |
| `GET` | `/api/tenants/{id}/users` | Get tenant users | - | `List<User>` |
| `POST` | `/api/tenants/{id}/admin` | Assign tenant admin | `AdminRequest` | `Tenant` |
| `GET` | `/api/tenants/{id}/config` | Get tenant config | - | `TenantConfig` |

### Request/Response Models

#### TenantRequest
```json
{
  "name": "Acme Corporation",
  "type": "enterprise",
  "industry": "technology",
  "country": "US",
  "contactEmail": "admin@acme.com",
  "contactPhone": "+1-555-0123",
  "website": "https://acme.com",
  "description": "Technology company",
  "userLimit": "1000",
  "dataRetention": "7_years",
  "complianceLevel": "high",
  "customDomain": "acme.kycpro.com",
  "ssoEnabled": true
}
```

#### Tenant
```json
{
  "id": "tenant-id",
  "name": "Acme Corporation",
  "type": "enterprise",
  "industry": "technology",
  "country": "US",
  "contactEmail": "admin@acme.com",
  "contactPhone": "+1-555-0123",
  "website": "https://acme.com",
  "description": "Technology company",
  "subscribedApplications": ["ekyc", "sop"],
  "userLimit": "1000",
  "dataRetention": "7_years",
  "complianceLevel": "high",
  "customDomain": "acme.kycpro.com",
  "ssoEnabled": true,
  "status": "active",
  "createdAt": "2024-01-01T00:00:00Z",
  "tenantAdminId": "admin-user-id",
  "users": ["user1", "user2"],
  "monthlyRevenue": 1500.00
}
```

## 🔧 Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `SERVER_PORT` | 9083 | Service port |
| `DATABASE_URL` | jdbc:postgresql://localhost:5432/ekyc_platform | Database connection URL |
| `DATABASE_USERNAME` | saas_user | Database username |
| `DATABASE_PASSWORD` | saas_password | Database password |

## 🔄 Service Dependencies

### Dependencies
- **PostgreSQL Database** - Tenant data storage
- **Eureka Server** - Service discovery

### Dependents
- **API Gateway** - Routes tenant management requests
- **User Service** - Tenant user management
- **Subscription Service** - Tenant billing integration
- **Frontend Applications** - Tenant management UI

## 🚀 Deployment

### Docker Configuration
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/tenant-service.jar app.jar
EXPOSE 9083
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Docker Compose
```yaml
tenant-service:
  build: ./tenant-service
  ports:
    - "9083:9083"
  environment:
    - DATABASE_URL=jdbc:postgresql://postgres:5432/ekyc_platform
    - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
  depends_on:
    - postgres
    - eureka-server
```

## 🔍 Troubleshooting

### Common Issues

1. **Tenant Creation Failures**
   - Check database connectivity
   - Verify tenant validation rules
   - Review tenant admin assignment
   - Check subscription service integration

2. **Tenant Isolation Issues**
   - Verify tenant context filtering
   - Check data access controls
   - Review tenant-specific configurations
   - Monitor cross-tenant data access

3. **Configuration Management Issues**
   - Check tenant configuration storage
   - Verify configuration validation
   - Review configuration inheritance
   - Monitor configuration updates

### Logs to Monitor
```bash
# Tenant service logs
docker logs tenant-service

# Tenant management logs
grep "tenant" application.log

# Configuration logs
grep "config" application.log
```

## 📈 Performance Considerations

### Optimization Tips
- **Database Indexing**: Index tenant-specific fields
- **Connection Pooling**: Optimize database connections
- **Caching**: Cache tenant configurations
- **Pagination**: Implement pagination for large tenant lists

### Security Considerations
- **Tenant Isolation**: Ensure strict data isolation
- **Access Control**: Implement tenant-based access control
- **Data Encryption**: Encrypt sensitive tenant data
- **Audit Logging**: Log all tenant operations

## 🧪 Testing

### Health Check Commands
```bash
# Service health
curl http://localhost:9083/actuator/health

# Get all tenants
curl http://localhost:9083/api/tenants

# Get tenant by ID
curl http://localhost:9083/api/tenants/{tenant-id}

# Create tenant
curl -X POST http://localhost:9083/api/tenants \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Corp","type":"enterprise","contactEmail":"admin@test.com"}'
```

### Integration Testing
```bash
# Test with API Gateway
curl http://localhost:9080/api/tenants/health

# Test tenant users
curl http://localhost:9080/api/tenants/{tenant-id}/users
```

## 🔐 Security Features

### Tenant Management Flow
1. **Tenant Creation**: Validate input and create tenant
2. **Admin Assignment**: Assign tenant administrator
3. **Configuration Setup**: Initialize tenant-specific settings
4. **User Management**: Handle tenant user operations
5. **Lifecycle Management**: Handle tenant status changes

### Security Measures
- **Tenant Isolation**: Strict data isolation between tenants
- **Access Control**: Tenant-based authorization
- **Input Validation**: Validate all tenant input data
- **Audit Logging**: Log all tenant operations
- **Data Encryption**: Encrypt sensitive tenant data

## 📚 Related Documentation

- [API Gateway](./api-gateway.md) - Routes tenant management requests
- [User Service](./user-service.md) - Tenant user management
- [Subscription Service](./subscription-service.md) - Billing integration
- [Database Schema](../database/database-schema.md) - Tenant data schema
- [Multi-Tenancy](../business/multi-tenancy.md) - Multi-tenant architecture

---

*Last Updated: [Current Date]*  
*Service Version: 1.0.0* 