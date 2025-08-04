# Keycloak Sync Service

## 📋 Service Overview

**Service Name**: Keycloak Sync Service  
**Port**: 9087  
**Application Name**: `keycloak-sync-service`  
**Health Check**: http://localhost:9087/actuator/health  
**Base URL**: http://localhost:9087/api/keycloak-sync

## 🎯 Purpose & Functionality

The Keycloak Sync Service is responsible for **synchronizing user and role data** between the KYC-Pro platform and Keycloak identity provider. It ensures consistency between the platform's user management and Keycloak's identity management.

### Key Responsibilities:
- **User Synchronization**: Sync user data between platform and Keycloak
- **Role Synchronization**: Sync role assignments and permissions
- **Tenant Management**: Handle tenant-specific user and role sync
- **Audit Logging**: Track synchronization activities and changes
- **Conflict Resolution**: Handle data conflicts between systems
- **Real-time Sync**: Provide real-time synchronization capabilities
- **Batch Processing**: Handle bulk synchronization operations

## ⚙️ Configuration Details

### Server Configuration
```yaml
server:
  port: 9087
```

### Spring Application Configuration
```yaml
spring:
  application:
    name: keycloak-sync-service
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
```

### Keycloak Configuration
```yaml
keycloak:
  auth-server-url: ${KEYCLOAK_URL:http://localhost:8080}
  realm: ${KEYCLOAK_REALM:ekyc}
  client-id: ${KEYCLOAK_CLIENT_ID:admin-cli}
  client-secret: ${KEYCLOAK_CLIENT_SECRET:}
  admin:
    username: ${KEYCLOAK_ADMIN_USERNAME:admin}
    password: ${KEYCLOAK_ADMIN_PASSWORD:admin123}
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
    com.ekyc.keycloaksyncservice: DEBUG
    org.keycloak: DEBUG
```

## 🔌 API Endpoints

### Synchronization Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/api/keycloak-sync/users` | Sync users to Keycloak | `UserSyncRequest` | `SyncResponse` |
| `POST` | `/api/keycloak-sync/roles` | Sync roles to Keycloak | `RoleSyncRequest` | `SyncResponse` |
| `POST` | `/api/keycloak-sync/tenant/{tenantId}` | Sync tenant data | `TenantSyncRequest` | `SyncResponse` |
| `GET` | `/api/keycloak-sync/status` | Get sync status | - | `SyncStatus` |
| `POST` | `/api/keycloak-sync/validate` | Validate sync data | `ValidationRequest` | `ValidationResponse` |
| `GET` | `/api/keycloak-sync/audit` | Get sync audit logs | - | `List<AuditLog>` |

### Request/Response Models

#### UserSyncRequest
```json
{
  "users": [
    {
      "id": "user-id",
      "email": "user@example.com",
      "username": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "enabled": true,
      "emailVerified": true,
      "attributes": {
        "tenantId": "tenant-id",
        "role": "platform_user"
      }
    }
  ],
  "operation": "CREATE"
}
```

#### SyncResponse
```json
{
  "status": "SUCCESS",
  "message": "Sync completed successfully",
  "syncedCount": 10,
  "failedCount": 0,
  "errors": [],
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🔧 Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `SERVER_PORT` | 9087 | Service port |
| `DATABASE_URL` | jdbc:postgresql://localhost:5432/ekyc_platform | Database connection URL |
| `DATABASE_USERNAME` | saas_user | Database username |
| `DATABASE_PASSWORD` | saas_password | Database password |
| `KEYCLOAK_URL` | http://localhost:8080 | Keycloak server URL |
| `KEYCLOAK_REALM` | ekyc | Keycloak realm name |
| `KEYCLOAK_CLIENT_ID` | admin-cli | Keycloak admin client ID |
| `KEYCLOAK_CLIENT_SECRET` | | Keycloak admin client secret |
| `KEYCLOAK_ADMIN_USERNAME` | admin | Keycloak admin username |
| `KEYCLOAK_ADMIN_PASSWORD` | admin123 | Keycloak admin password |

## 🔄 Service Dependencies

### Dependencies
- **PostgreSQL Database** - Sync data storage
- **Keycloak** - Identity provider integration
- **Eureka Server** - Service discovery

### Dependents
- **API Gateway** - Routes sync management requests
- **Auth Service** - Authentication integration
- **User Service** - User management integration
- **Registry Service** - Role management integration

## 🚀 Deployment

### Docker Configuration
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/keycloak-sync-service.jar app.jar
EXPOSE 9087
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Docker Compose
```yaml
keycloak-sync-service:
  build: ./keycloak-sync-service
  ports:
    - "9087:9087"
  environment:
    - DATABASE_URL=jdbc:postgresql://postgres:5432/ekyc_platform
    - KEYCLOAK_URL=http://keycloak:8080
    - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
  depends_on:
    - postgres
    - keycloak
    - eureka-server
```

## 🔍 Troubleshooting

### Common Issues

1. **Keycloak Connection Issues**
   - Check Keycloak server availability
   - Verify admin credentials
   - Review client configuration
   - Check network connectivity

2. **Sync Failures**
   - Verify data validation rules
   - Check Keycloak permissions
   - Review sync conflict resolution
   - Monitor sync performance

3. **Data Inconsistency Issues**
   - Check sync status and logs
   - Verify data mapping rules
   - Review conflict resolution logic
   - Monitor data integrity

### Logs to Monitor
```bash
# Keycloak sync service logs
docker logs keycloak-sync-service

# Sync operation logs
grep "sync" application.log

# Keycloak integration logs
grep "keycloak" application.log
```

## 📈 Performance Considerations

### Optimization Tips
- **Batch Processing**: Process sync operations in batches
- **Connection Pooling**: Optimize Keycloak client connections
- **Caching**: Cache frequently accessed data
- **Async Processing**: Use async processing for large sync operations

### Security Considerations
- **Secure Credentials**: Secure Keycloak admin credentials
- **Data Encryption**: Encrypt sensitive sync data
- **Access Control**: Implement sync-based access control
- **Audit Logging**: Log all sync operations

## 🧪 Testing

### Health Check Commands
```bash
# Service health
curl http://localhost:9087/actuator/health

# Get sync status
curl http://localhost:9087/api/keycloak-sync/status

# Validate sync data
curl -X POST http://localhost:9087/api/keycloak-sync/validate \
  -H "Content-Type: application/json" \
  -d '{"operation":"VALIDATE","data":{}}'
```

### Integration Testing
```bash
# Test with API Gateway
curl http://localhost:9080/api/keycloak-sync/health

# Test user sync
curl -X POST http://localhost:9080/api/keycloak-sync/users \
  -H "Content-Type: application/json" \
  -d '{"users":[],"operation":"CREATE"}'
```

## 🔐 Security Features

### Synchronization Flow
1. **Data Validation**: Validate sync data before processing
2. **Keycloak Authentication**: Authenticate with Keycloak admin
3. **Data Mapping**: Map platform data to Keycloak format
4. **Sync Execution**: Execute sync operations
5. **Conflict Resolution**: Handle data conflicts
6. **Audit Logging**: Log all sync activities

### Security Measures
- **Secure Authentication**: Secure Keycloak admin authentication
- **Data Validation**: Validate all sync data
- **Access Control**: Sync-based authorization
- **Audit Logging**: Log all sync operations
- **Data Encryption**: Encrypt sensitive sync data

## 📚 Related Documentation

- [API Gateway](./api-gateway.md) - Routes sync management requests
- [Auth Service](./auth-service.md) - Authentication integration
- [User Service](./user-service.md) - User management integration
- [Registry Service](./registry-service.md) - Role management integration
- [Keycloak Configuration](../infrastructure/keycloak-configuration.md) - Identity provider setup

---

*Last Updated: [Current Date]*  
*Service Version: 1.0.0* 