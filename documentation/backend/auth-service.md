# Auth Service

## 📋 Service Overview

**Service Name**: Auth Service  
**Port**: 9081  
**Application Name**: `auth-service`  
**Health Check**: http://localhost:9081/actuator/health  
**Base URL**: http://localhost:9081/api/auth

## 🎯 Purpose & Functionality

The Auth Service is responsible for **authentication and authorization** in the KYC-Pro platform. It handles user login, registration, JWT token management, and integration with Keycloak for identity management.

### Key Responsibilities:
- **User Authentication**: Login and logout functionality
- **User Registration**: New user signup and account creation
- **JWT Token Management**: Token generation, validation, and refresh
- **Password Management**: Password encoding and validation
- **Keycloak Integration**: Synchronization with Keycloak identity provider
- **Profile Management**: User profile retrieval and updates
- **Session Management**: User session handling and security

## ⚙️ Configuration Details

### Server Configuration
```yaml
server:
  port: 9081
```

### Spring Application Configuration
```yaml
spring:
  application:
    name: auth-service
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
  jackson:
    date-format: yyyy-MM-dd
    time-zone: UTC
```

### JWT Configuration
```yaml
jwt:
  secret: mySuperSecretKeyWhichShouldBeOverridden
  expiration: 86400 # in seconds (1 day)
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

### Service URLs
```yaml
user:
  service:
    url: ${USER_SERVICE_URL:http://localhost:9082}

tenant:
  service:
    url: ${TENANT_SERVICE_URL:http://localhost:9082}
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

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/api/auth/login` | User login | `LoginRequest` | `AuthResponse` |
| `POST` | `/api/auth/signup` | User registration | `SignupRequest` | `AuthResponse` |
| `GET` | `/api/auth/profile/{email}` | Get user profile | - | `AuthResponse` |
| `GET` | `/api/auth/test` | Service health test | - | `String` |

### Request/Response Models

#### LoginRequest
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### SignupRequest
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "platform_user",
  "tenantId": "optional-tenant-id"
}
```

#### AuthResponse
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "platform_user",
    "tenantId": "tenant-id"
  }
}
```

## 🔧 Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `SERVER_PORT` | 9081 | Service port |
| `DATABASE_URL` | jdbc:postgresql://localhost:5432/ekyc_platform | Database connection URL |
| `DATABASE_USERNAME` | saas_user | Database username |
| `DATABASE_PASSWORD` | saas_password | Database password |
| `JWT_SECRET` | mySuperSecretKeyWhichShouldBeOverridden | JWT signing secret |
| `JWT_EXPIRATION` | 86400 | JWT token expiration in seconds |
| `KEYCLOAK_AUTH_SERVER_URL` | http://localhost:8080 | Keycloak server URL |
| `KEYCLOAK_REALM` | ekyc | Keycloak realm name |
| `KEYCLOAK_CLIENT_ID` | ekyc-platform-client | Keycloak client ID |
| `KEYCLOAK_CLIENT_SECRET` | emT3O4n4T5sfjuxM1cScYM8RS6bZZoE7 | Keycloak client secret |
| `USER_SERVICE_URL` | http://localhost:9082 | User service URL |
| `TENANT_SERVICE_URL` | http://localhost:9082 | Tenant service URL |

## 🔄 Service Dependencies

### Dependencies
- **PostgreSQL Database** - User data storage
- **Keycloak** - Identity provider integration
- **User Service** - User management operations
- **Tenant Service** - Tenant management operations
- **Eureka Server** - Service discovery

### Dependents
- **API Gateway** - Routes authentication requests
- **Frontend Applications** - Consume authentication endpoints
- **Other Microservices** - Validate JWT tokens

## 🚀 Deployment

### Docker Configuration
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/auth-service.jar app.jar
EXPOSE 9081
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Docker Compose
```yaml
auth-service:
  build: ./auth-service
  ports:
    - "9081:9081"
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

1. **Authentication Failures**
   - Check Keycloak server connectivity
   - Verify client credentials
   - Review JWT token configuration
   - Check database connectivity

2. **JWT Token Issues**
   - Verify JWT secret configuration
   - Check token expiration settings
   - Review token validation logic
   - Monitor token refresh process

3. **Database Connection Issues**
   - Verify database URL and credentials
   - Check database server availability
   - Review connection pool settings
   - Monitor database performance

### Logs to Monitor
```bash
# Auth service logs
docker logs auth-service

# Authentication logs
grep "auth" application.log

# JWT token logs
grep "jwt" application.log
```

## 📈 Performance Considerations

### Optimization Tips
- **JWT Token Caching**: Cache validated tokens
- **Database Connection Pooling**: Optimize database connections
- **Keycloak Connection Pooling**: Configure Keycloak client connections
- **Response Caching**: Cache user profile data

### Security Considerations
- **JWT Secret**: Use strong, unique secrets in production
- **Token Expiration**: Configure appropriate token lifetimes
- **Password Security**: Implement strong password policies
- **Rate Limiting**: Prevent brute force attacks

## 🧪 Testing

### Health Check Commands
```bash
# Service health
curl http://localhost:9081/actuator/health

# Test endpoint
curl http://localhost:9081/api/auth/test

# Login test
curl -X POST http://localhost:9081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Integration Testing
```bash
# Test with API Gateway
curl http://localhost:9080/api/auth/health

# Test JWT token validation
curl -H "Authorization: Bearer <token>" \
  http://localhost:9081/api/auth/profile/test@example.com
```

## 🔐 Security Features

### Authentication Flow
1. **User Login**: User provides credentials
2. **Credential Validation**: Verify against database/Keycloak
3. **JWT Generation**: Create signed JWT token
4. **Token Response**: Return token to client
5. **Token Validation**: Validate tokens on subsequent requests

### Security Measures
- **Password Hashing**: BCrypt password encoding
- **JWT Signing**: HMAC-SHA256 token signing
- **Token Expiration**: Configurable token lifetime
- **Input Validation**: Request payload validation
- **SQL Injection Prevention**: Parameterized queries

## 📚 Related Documentation

- [API Gateway](./api-gateway.md) - Routes authentication requests
- [User Service](./user-service.md) - User management integration
- [Tenant Service](./tenant-service.md) - Tenant management integration
- [Keycloak Configuration](../infrastructure/keycloak-configuration.md) - Identity provider setup
- [Database Schema](../database/database-schema.md) - User data schema

---

*Last Updated: [Current Date]*  
*Service Version: 1.0.0* 