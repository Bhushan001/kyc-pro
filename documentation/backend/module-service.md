# Module Service

## 📋 Service Overview

**Service Name**: Module Service  
**Port**: 9084  
**Application Name**: `module-service`  
**Health Check**: http://localhost:9084/actuator/health  
**Base URL**: http://localhost:9084/api/modules

## 🎯 Purpose & Functionality

The Module Service is responsible for **business module management** in the KYC-Pro platform. It handles module configuration, feature management, and tenant-specific module assignments for the modular KYC platform architecture.

### Key Responsibilities:
- **Module CRUD Operations**: Create, read, update, delete business modules
- **Module Configuration**: Manage module-specific settings and features
- **Tenant Module Assignment**: Handle module assignments to tenants
- **Feature Management**: Manage individual features within modules
- **Module Lifecycle**: Handle module activation, deactivation, and updates
- **Module Analytics**: Track module usage and performance metrics
- **Integration Management**: Handle module integrations and dependencies

## ⚙️ Configuration Details

### Server Configuration
```yaml
server:
  port: 9084
```

### Spring Application Configuration
```yaml
spring:
  application:
    name: module-service
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

## 🔌 API Endpoints

### Module Management Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/modules` | Get all modules | - | `List<Module>` |
| `GET` | `/api/modules/{id}` | Get module by ID | - | `Module` |
| `POST` | `/api/modules` | Create new module | `ModuleRequest` | `Module` |
| `PUT` | `/api/modules/{id}` | Update module | `ModuleRequest` | `Module` |
| `DELETE` | `/api/modules/{id}` | Delete module | - | `void` |
| `GET` | `/api/modules/tenant/{tenantId}` | Get tenant modules | - | `List<Module>` |
| `POST` | `/api/modules/{id}/assign` | Assign module to tenant | `AssignmentRequest` | `Module` |
| `GET` | `/api/modules/{id}/features` | Get module features | - | `List<Feature>` |

### Request/Response Models

#### ModuleRequest
```json
{
  "name": "E-KYC",
  "description": "Digital Know Your Customer verification",
  "version": "1.0.0",
  "price": 499.00,
  "features": ["Document OCR", "Biometric Verification", "AI Risk Assessment"],
  "status": "active",
  "category": "verification"
}
```

#### Module
```json
{
  "id": "module-id",
  "name": "E-KYC",
  "description": "Digital Know Your Customer verification",
  "version": "1.0.0",
  "price": 499.00,
  "features": ["Document OCR", "Biometric Verification", "AI Risk Assessment"],
  "status": "active",
  "category": "verification",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "assignedTenants": ["tenant1", "tenant2"]
}
```

## 🔧 Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `SERVER_PORT` | 9084 | Service port |
| `DATABASE_URL` | jdbc:postgresql://localhost:5432/ekyc_platform | Database connection URL |
| `DATABASE_USERNAME` | saas_user | Database username |
| `DATABASE_PASSWORD` | saas_password | Database password |

## 🔄 Service Dependencies

### Dependencies
- **PostgreSQL Database** - Module data storage
- **Eureka Server** - Service discovery

### Dependents
- **API Gateway** - Routes module management requests
- **Tenant Service** - Module assignment integration
- **Subscription Service** - Module billing integration
- **Frontend Applications** - Module management UI

## 🚀 Deployment

### Docker Configuration
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/module-service.jar app.jar
EXPOSE 9084
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Docker Compose
```yaml
module-service:
  build: ./module-service
  ports:
    - "9084:9084"
  environment:
    - DATABASE_URL=jdbc:postgresql://postgres:5432/ekyc_platform
    - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
  depends_on:
    - postgres
    - eureka-server
```

## 🔍 Troubleshooting

### Common Issues

1. **Module Creation Failures**
   - Check database connectivity
   - Verify module validation rules
   - Review feature configuration
   - Check module dependencies

2. **Module Assignment Issues**
   - Verify tenant existence
   - Check module availability
   - Review assignment permissions
   - Monitor subscription status

3. **Feature Management Issues**
   - Check feature configuration
   - Verify feature dependencies
   - Review feature validation
   - Monitor feature performance

### Logs to Monitor
```bash
# Module service logs
docker logs module-service

# Module management logs
grep "module" application.log

# Feature logs
grep "feature" application.log
```

## 📈 Performance Considerations

### Optimization Tips
- **Database Indexing**: Index module-specific fields
- **Connection Pooling**: Optimize database connections
- **Caching**: Cache module configurations
- **Pagination**: Implement pagination for large module lists

### Security Considerations
- **Access Control**: Implement module-based access control
- **Data Validation**: Validate all module input data
- **Audit Logging**: Log all module operations
- **Data Encryption**: Encrypt sensitive module data

## 🧪 Testing

### Health Check Commands
```bash
# Service health
curl http://localhost:9084/actuator/health

# Get all modules
curl http://localhost:9084/api/modules

# Get module by ID
curl http://localhost:9084/api/modules/{module-id}

# Create module
curl -X POST http://localhost:9084/api/modules \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Module","description":"Test module","price":100.00}'
```

### Integration Testing
```bash
# Test with API Gateway
curl http://localhost:9080/api/modules/health

# Test tenant modules
curl http://localhost:9080/api/modules/tenant/{tenant-id}
```

## 🔐 Security Features

### Module Management Flow
1. **Module Creation**: Validate input and create module
2. **Feature Configuration**: Set up module features
3. **Tenant Assignment**: Assign modules to tenants
4. **Access Control**: Manage module access permissions
5. **Lifecycle Management**: Handle module status changes

### Security Measures
- **Access Control**: Module-based authorization
- **Input Validation**: Validate all module input data
- **Audit Logging**: Log all module operations
- **Data Encryption**: Encrypt sensitive module data

## 📚 Related Documentation

- [API Gateway](./api-gateway.md) - Routes module management requests
- [Tenant Service](./tenant-service.md) - Module assignment integration
- [Subscription Service](./subscription-service.md) - Billing integration
- [Database Schema](../database/database-schema.md) - Module data schema

---

*Last Updated: [Current Date]*  
*Service Version: 1.0.0* 