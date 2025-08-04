# User Service

## 📋 Service Overview

**Service Name**: User Service  
**Port**: 9082  
**Application Name**: `user-service`  
**Health Check**: http://localhost:9082/actuator/health  
**Base URL**: http://localhost:9082/api/users

## 🎯 Purpose & Functionality

The User Service is responsible for **user management** within the KYC-Pro platform. It handles user CRUD operations, role assignment, tenant-specific user management, and integration with Keycloak for identity synchronization.

### Key Responsibilities:
- **User CRUD Operations**: Create, read, update, delete user accounts
- **Role Management**: Assign and manage user roles within tenants
- **Tenant User Management**: Handle user operations within tenant context
- **Profile Management**: User profile information and updates
- **Keycloak Integration**: Synchronize user data with Keycloak
- **User Search**: Find users by various criteria
- **Bulk Operations**: Handle multiple user operations

## ⚙️ Configuration Details

### Server Configuration
```yaml
server:
  port: 9082
```

### Spring Application Configuration
```yaml
spring:
  application:
    name: user-service
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
  auth-server-url: ${KEYCLOAK_AUTH_SERVER_URL:http://localhost:8080}
  realm: ${KEYCLOAK_REALM:ekyc}
  resource: ${KEYCLOAK_CLIENT_ID:ekyc-platform-client}
  credentials:
    secret: ${KEYCLOAK_CLIENT_SECRET:emT3O4n4T5sfjuxM1cScYM8RS6bZZoE7}
  principal-attribute: ${KEYCLOAK_PRINCIPAL_ATTRIBUTE:preferred_username}
  public-client: false
  confidential-port: 0
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
    com.ekyc.userservice: DEBUG
```

## 🔌 API Endpoints

### User Management Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/users` | Get all users | - | `List<User>` |
| `GET` | `/api/users/{id}` | Get user by ID | - | `User` |
| `POST` | `/api/users` | Create new user | `UserRequest` | `User` |
| `PUT` | `/api/users/{id}` | Update user | `UserRequest` | `User` |
| `DELETE` | `/api/users/{id}` | Delete user | - | `void` |
| `GET` | `/api/users/tenant/{tenantId}` | Get users by tenant | - | `List<User>` |
| `GET` | `/api/users/search` | Search users | Query params | `List<User>` |

### Request/Response Models

#### UserRequest
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "platform_user",
  "tenantId": "tenant-id",
  "status": "active"
}
```

#### User
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "platform_user",
  "tenantId": "tenant-id",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## 🔧 Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `SERVER_PORT` | 9082 | Service port |
| `DATABASE_URL` | jdbc:postgresql://localhost:5432/ekyc_platform | Database connection URL |
| `DATABASE_USERNAME` | saas_user | Database username |
| `DATABASE_PASSWORD` | saas_password | Database password |
| `KEYCLOAK_AUTH_SERVER_URL` | http://localhost:8080 | Keycloak server URL |
| `KEYCLOAK_REALM` | ekyc | Keycloak realm name |
| `KEYCLOAK_CLIENT_ID` | ekyc-platform-client | Keycloak client ID |
| `KEYCLOAK_CLIENT_SECRET` | emT3O4n4T5sfjuxM1cScYM8RS6bZZoE7 | Keycloak client secret |

## 🔄 Service Dependencies

### Dependencies
- **PostgreSQL Database** - User data storage
- **Keycloak** - Identity provider integration
- **Eureka Server** - Service discovery

### Dependents
- **API Gateway** - Routes user management requests
- **Auth Service** - User authentication integration
- **Tenant Service** - Tenant user management
- **Frontend Applications** - User management UI

## 🚀 Deployment

### Docker Configuration
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/user-service.jar app.jar
EXPOSE 9082
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Docker Compose
```yaml
user-service:
  build: ./user-service
  ports:
    - "9082:9082"
  environment:
    - DATABASE_URL=jdbc:postgresql://postgres:5432/ekyc_platform
    - KEYCLOAK_AUTH_SERVER_URL=http://keycloak:8080
    - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
  depends_on:
    - postgres
    - keycloak
    - eureka-server
```

## 🔍 Troubleshooting

### Common Issues

1. **User Creation Failures**
   - Check database connectivity
   - Verify Keycloak integration
   - Review user validation rules
   - Check tenant existence

2. **Role Assignment Issues**
   - Verify role permissions
   - Check tenant context
   - Review role validation logic
   - Monitor Keycloak synchronization

3. **Search Performance Issues**
   - Optimize database queries
   - Add appropriate indexes
   - Review search criteria
   - Monitor query performance

### Logs to Monitor
```bash
# User service logs
docker logs user-service

# User management logs
grep "user" application.log

# Keycloak sync logs
grep "keycloak" application.log
```

## 📈 Performance Considerations

### Optimization Tips
- **Database Indexing**: Index frequently queried fields
- **Connection Pooling**: Optimize database connections
- **Caching**: Cache frequently accessed user data
- **Pagination**: Implement pagination for large user lists

### Security Considerations
- **Input Validation**: Validate all user input
- **Role-based Access**: Implement proper authorization
- **Data Encryption**: Encrypt sensitive user data
- **Audit Logging**: Log all user operations

## 🧪 Testing

### Health Check Commands
```bash
# Service health
curl http://localhost:9082/actuator/health

# Get all users
curl http://localhost:9082/api/users

# Get user by ID
curl http://localhost:9082/api/users/{user-id}

# Create user
curl -X POST http://localhost:9082/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","role":"platform_user"}'
```

### Integration Testing
```bash
# Test with API Gateway
curl http://localhost:9080/api/users/health

# Test tenant-specific users
curl http://localhost:9080/api/users/tenant/{tenant-id}
```

## 🔐 Security Features

### User Management Flow
1. **User Creation**: Validate input and create user
2. **Role Assignment**: Assign appropriate roles
3. **Tenant Association**: Link user to tenant
4. **Keycloak Sync**: Synchronize with identity provider
5. **Profile Management**: Handle user profile updates

### Security Measures
- **Input Validation**: Validate all user input data
- **Role-based Authorization**: Check user permissions
- **Tenant Isolation**: Ensure tenant data isolation
- **Audit Logging**: Log all user operations
- **Data Encryption**: Encrypt sensitive user data

## 📚 Related Documentation

- [API Gateway](./api-gateway.md) - Routes user management requests
- [Auth Service](./auth-service.md) - Authentication integration
- [Tenant Service](./tenant-service.md) - Tenant management integration
- [Keycloak Configuration](../infrastructure/keycloak-configuration.md) - Identity provider setup
- [Database Schema](../database/database-schema.md) - User data schema

---

*Last Updated: [Current Date]*  
*Service Version: 1.0.0* 