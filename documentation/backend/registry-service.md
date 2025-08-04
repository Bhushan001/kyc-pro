# Registry Service

## 📋 Service Overview

**Service Name**: Registry Service  
**Port**: 9086  
**Application Name**: `registry-service`  
**Health Check**: http://localhost:9086/actuator/health  
**Base URL**: http://localhost:9086/api/registry

## 🎯 Purpose & Functionality

The Registry Service is responsible for **role management and lifecycle** in the KYC-Pro platform. It handles role creation, validation, assignment, and business rules for the role-based access control system.

### Key Responsibilities:
- **Role CRUD Operations**: Create, read, update, delete roles
- **Role Validation**: Validate role assignments and permissions
- **Business Rules**: Implement role-based business rules
- **Role Hierarchy**: Manage role hierarchies and inheritance
- **Permission Management**: Handle role permissions and access control
- **Integration with Keycloak Sync**: Coordinate with Keycloak Sync Service
- **Audit Logging**: Track role changes and assignments

## ⚙️ Configuration Details

### Server Configuration
```yaml
server:
  port: 9086
```

### Spring Application Configuration
```yaml
spring:
  application:
    name: registry-service
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/ekyc_platform}
    username: ${DATABASE_USERNAME:saas_user}
    password: ${DATABASE_PASSWORD:saas_password}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  sql:
    init:
      mode: always
      schema-locations: classpath:cleanup.sql,classpath:schema.sql,classpath:migration.sql
      continue-on-error: true
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
        include: health,info,metrics
  endpoint:
    health:
      show-details: always
```

### Logging Configuration
```yaml
logging:
  level:
    com.ekyc.registryservice: DEBUG
```

## 🔌 API Endpoints

### Registry Management Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/registry/roles` | Get all roles | - | `List<Role>` |
| `GET` | `/api/registry/roles/{id}` | Get role by ID | - | `Role` |
| `POST` | `/api/registry/roles` | Create new role | `RoleRequest` | `Role` |
| `PUT` | `/api/registry/roles/{id}` | Update role | `RoleRequest` | `Role` |
| `DELETE` | `/api/registry/roles/{id}` | Delete role | - | `void` |
| `GET` | `/api/registry/roles/tenant/{tenantId}` | Get tenant roles | - | `List<Role>` |
| `POST` | `/api/registry/roles/{id}/assign` | Assign role to user | `AssignmentRequest` | `Role` |
| `GET` | `/api/registry/roles/{id}/permissions` | Get role permissions | - | `List<Permission>` |

### Request/Response Models

#### RoleRequest
```json
{
  "name": "PLATFORM_USER",
  "description": "Platform user with basic access",
  "permissions": ["READ", "WRITE"],
  "tenantId": "tenant-id",
  "status": "active"
}
```

#### Role
```json
{
  "id": "role-id",
  "name": "PLATFORM_USER",
  "description": "Platform user with basic access",
  "permissions": ["READ", "WRITE"],
  "tenantId": "tenant-id",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "assignedUsers": ["user1", "user2"]
}
```

## 🔧 Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `SERVER_PORT` | 9086 | Service port |
| `DATABASE_URL` | jdbc:postgresql://localhost:5432/ekyc_platform | Database connection URL |
| `DATABASE_USERNAME` | saas_user | Database username |
| `DATABASE_PASSWORD` | saas_password | Database password |

## 🔄 Service Dependencies

### Dependencies
- **PostgreSQL Database** - Registry data storage
- **Eureka Server** - Service discovery

### Dependents
- **API Gateway** - Routes registry management requests
- **Keycloak Sync Service** - Role synchronization integration
- **User Service** - User role management
- **Frontend Applications** - Role management UI

## 🚀 Deployment

### Docker Configuration
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/registry-service.jar app.jar
EXPOSE 9086
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Docker Compose
```yaml
registry-service:
  build: ./registry-service
  ports:
    - "9086:9086"
  environment:
    - DATABASE_URL=jdbc:postgresql://postgres:5432/ekyc_platform
    - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
  depends_on:
    - postgres
    - eureka-server
```

## 🔍 Troubleshooting

### Common Issues

1. **Role Creation Failures**
   - Check database connectivity
   - Verify role validation rules
   - Review permission configuration
   - Check role hierarchy rules

2. **Role Assignment Issues**
   - Verify user existence
   - Check role availability
   - Review assignment permissions
   - Monitor role conflicts

3. **Permission Management Issues**
   - Check permission configuration
   - Verify permission validation
   - Review permission inheritance
   - Monitor permission conflicts

### Logs to Monitor
```bash
# Registry service logs
docker logs registry-service

# Role management logs
grep "role" application.log

# Permission logs
grep "permission" application.log
```

## 📈 Performance Considerations

### Optimization Tips
- **Database Indexing**: Index role-specific fields
- **Connection Pooling**: Optimize database connections
- **Caching**: Cache role and permission data
- **Pagination**: Implement pagination for large role lists

### Security Considerations
- **Access Control**: Implement role-based access control
- **Data Validation**: Validate all role input data
- **Audit Logging**: Log all role operations
- **Data Encryption**: Encrypt sensitive role data

## 🧪 Testing

### Health Check Commands
```bash
# Service health
curl http://localhost:9086/actuator/health

# Get all roles
curl http://localhost:9086/api/registry/roles

# Get role by ID
curl http://localhost:9086/api/registry/roles/{role-id}

# Create role
curl -X POST http://localhost:9086/api/registry/roles \
  -H "Content-Type: application/json" \
  -d '{"name":"TEST_ROLE","description":"Test role","permissions":["READ"]}'
```

### Integration Testing
```bash
# Test with API Gateway
curl http://localhost:9080/api/registry/health

# Test tenant roles
curl http://localhost:9080/api/registry/roles/tenant/{tenant-id}
```

## 🔐 Security Features

### Role Management Flow
1. **Role Creation**: Validate input and create role
2. **Permission Assignment**: Assign permissions to role
3. **User Assignment**: Assign role to users
4. **Validation**: Validate role assignments
5. **Synchronization**: Sync with Keycloak

### Security Measures
- **Access Control**: Role-based authorization
- **Input Validation**: Validate all role input data
- **Audit Logging**: Log all role operations
- **Data Encryption**: Encrypt sensitive role data

## 📚 Related Documentation

- [API Gateway](./api-gateway.md) - Routes registry management requests
- [Keycloak Sync Service](./keycloak-sync-service.md) - Role synchronization integration
- [User Service](./user-service.md) - User role management
- [Database Schema](../database/database-schema.md) - Registry data schema

---

*Last Updated: [Current Date]*  
*Service Version: 1.0.0* 