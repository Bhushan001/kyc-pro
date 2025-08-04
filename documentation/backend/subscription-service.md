# Subscription Service

## 📋 Service Overview

**Service Name**: Subscription Service  
**Port**: 9085  
**Application Name**: `subscription-service`  
**Health Check**: http://localhost:9085/actuator/health  
**Base URL**: http://localhost:9085/api/subscriptions

## 🎯 Purpose & Functionality

The Subscription Service is responsible for **billing and subscription management** in the KYC-Pro platform. It handles subscription lifecycle, payment processing, billing cycles, and revenue tracking for the multi-tenant platform.

### Key Responsibilities:
- **Subscription CRUD Operations**: Create, read, update, delete subscriptions
- **Payment Processing**: Handle payment transactions and billing
- **Billing Cycles**: Manage monthly/annual billing cycles
- **Revenue Tracking**: Track subscription revenue and analytics
- **Plan Management**: Manage subscription plans and pricing
- **Invoice Generation**: Generate and manage billing invoices
- **Payment Integration**: Integrate with payment gateways

## ⚙️ Configuration Details

### Server Configuration
```yaml
server:
  port: 9085
```

### Spring Application Configuration
```yaml
spring:
  application:
    name: subscription-service
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

### Subscription Management Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/subscriptions` | Get all subscriptions | - | `List<Subscription>` |
| `GET` | `/api/subscriptions/{id}` | Get subscription by ID | - | `Subscription` |
| `POST` | `/api/subscriptions` | Create new subscription | `SubscriptionRequest` | `Subscription` |
| `PUT` | `/api/subscriptions/{id}` | Update subscription | `SubscriptionRequest` | `Subscription` |
| `DELETE` | `/api/subscriptions/{id}` | Cancel subscription | - | `void` |
| `GET` | `/api/subscriptions/tenant/{tenantId}` | Get tenant subscriptions | - | `List<Subscription>` |
| `POST` | `/api/subscriptions/{id}/renew` | Renew subscription | `RenewalRequest` | `Subscription` |
| `GET` | `/api/subscriptions/{id}/invoices` | Get subscription invoices | - | `List<Invoice>` |

### Request/Response Models

#### SubscriptionRequest
```json
{
  "tenantId": "tenant-id",
  "planId": "plan-id",
  "modules": ["ekyc", "sop"],
  "billingCycle": "monthly",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "amount": 1500.00,
  "status": "active"
}
```

#### Subscription
```json
{
  "id": "subscription-id",
  "tenantId": "tenant-id",
  "planId": "plan-id",
  "modules": ["ekyc", "sop"],
  "billingCycle": "monthly",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "amount": 1500.00,
  "status": "active",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "lastBillingDate": "2024-01-01T00:00:00Z",
  "nextBillingDate": "2024-02-01T00:00:00Z"
}
```

## 🔧 Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `SERVER_PORT` | 9085 | Service port |
| `DATABASE_URL` | jdbc:postgresql://localhost:5432/ekyc_platform | Database connection URL |
| `DATABASE_USERNAME` | saas_user | Database username |
| `DATABASE_PASSWORD` | saas_password | Database password |

## 🔄 Service Dependencies

### Dependencies
- **PostgreSQL Database** - Subscription data storage
- **Eureka Server** - Service discovery

### Dependents
- **API Gateway** - Routes subscription management requests
- **Tenant Service** - Tenant billing integration
- **Module Service** - Module billing integration
- **Frontend Applications** - Subscription management UI

## 🚀 Deployment

### Docker Configuration
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/subscription-service.jar app.jar
EXPOSE 9085
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Docker Compose
```yaml
subscription-service:
  build: ./subscription-service
  ports:
    - "9085:9085"
  environment:
    - DATABASE_URL=jdbc:postgresql://postgres:5432/ekyc_platform
    - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
  depends_on:
    - postgres
    - eureka-server
```

## 🔍 Troubleshooting

### Common Issues

1. **Subscription Creation Failures**
   - Check database connectivity
   - Verify subscription validation rules
   - Review payment processing
   - Check tenant existence

2. **Billing Issues**
   - Verify payment gateway integration
   - Check billing cycle configuration
   - Review invoice generation
   - Monitor payment processing

3. **Revenue Tracking Issues**
   - Check revenue calculation logic
   - Verify analytics data collection
   - Review reporting mechanisms
   - Monitor data accuracy

### Logs to Monitor
```bash
# Subscription service logs
docker logs subscription-service

# Subscription management logs
grep "subscription" application.log

# Billing logs
grep "billing" application.log
```

## 📈 Performance Considerations

### Optimization Tips
- **Database Indexing**: Index subscription-specific fields
- **Connection Pooling**: Optimize database connections
- **Caching**: Cache subscription data
- **Batch Processing**: Process billing in batches

### Security Considerations
- **Payment Security**: Secure payment processing
- **Data Encryption**: Encrypt sensitive billing data
- **Access Control**: Implement subscription-based access control
- **Audit Logging**: Log all subscription operations

## 🧪 Testing

### Health Check Commands
```bash
# Service health
curl http://localhost:9085/actuator/health

# Get all subscriptions
curl http://localhost:9085/api/subscriptions

# Get subscription by ID
curl http://localhost:9085/api/subscriptions/{subscription-id}

# Create subscription
curl -X POST http://localhost:9085/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"tenantId":"tenant-id","planId":"plan-id","amount":100.00}'
```

### Integration Testing
```bash
# Test with API Gateway
curl http://localhost:9080/api/subscriptions/health

# Test tenant subscriptions
curl http://localhost:9080/api/subscriptions/tenant/{tenant-id}
```

## 🔐 Security Features

### Subscription Management Flow
1. **Subscription Creation**: Validate input and create subscription
2. **Payment Processing**: Handle payment transactions
3. **Billing Cycle**: Manage recurring billing
4. **Invoice Generation**: Generate billing invoices
5. **Revenue Tracking**: Track subscription revenue

### Security Measures
- **Payment Security**: Secure payment processing
- **Data Encryption**: Encrypt sensitive billing data
- **Access Control**: Subscription-based authorization
- **Audit Logging**: Log all subscription operations

## 📚 Related Documentation

- [API Gateway](./api-gateway.md) - Routes subscription management requests
- [Tenant Service](./tenant-service.md) - Tenant billing integration
- [Module Service](./module-service.md) - Module billing integration
- [Database Schema](../database/database-schema.md) - Subscription data schema

---

*Last Updated: [Current Date]*  
*Service Version: 1.0.0* 