# API Gateway

## 📋 Service Overview

**Service Name**: API Gateway  
**Port**: 9080  
**Application Name**: `api-gateway`  
**Health Check**: http://localhost:9080/actuator/health  
**Gateway Routes**: http://localhost:9080/actuator/gateway/routes

## 🎯 Purpose & Functionality

The API Gateway is the **central entry point** for all client requests to the KYC-Pro platform. It provides routing, load balancing, and cross-cutting concerns like security, monitoring, and rate limiting.

### Key Responsibilities:
- **Request Routing**: Routes requests to appropriate microservices
- **Load Balancing**: Distributes load across service instances
- **Service Discovery**: Integrates with Eureka for dynamic service discovery
- **Cross-Cutting Concerns**: Handles authentication, logging, monitoring
- **API Aggregation**: Combines responses from multiple services
- **Rate Limiting**: Controls request rates to prevent abuse
- **CORS Handling**: Manages Cross-Origin Resource Sharing

## ⚙️ Configuration Details

### Server Configuration
```yaml
server:
  port: 9080
```

### Spring Application Configuration
```yaml
spring:
  application:
    name: api-gateway
  cloud:
    compatibility-verifier:
      enabled: false
    gateway:
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true
      routes:
        - id: health-check
          uri: http://localhost:9080
          predicates:
            - Path=/health
          filters:
            - RewritePath=/health, /actuator/health
```

### Eureka Client Configuration
```yaml
eureka:
  instance:
    prefer-ip-address: true
    lease-renewal-interval-in-seconds: 30
    lease-expiration-duration-in-seconds: 90
    health-check-url-path: /actuator/health
    instance-id: ${spring.application.name}:${server.port}
  client:
    enabled: ${EUREKA_ENABLED:true}
    service-url:
      defaultZone: ${EUREKA_CLIENT_SERVICEURL_DEFAULTZONE:http://localhost:8761/eureka/}
    register-with-eureka: ${EUREKA_ENABLED:true}
    fetch-registry: ${EUREKA_ENABLED:true}
```

### Management Endpoints
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,gateway,routes
  endpoint:
    health:
      show-details: always
    gateway:
      enabled: true
```

### Logging Configuration
```yaml
logging:
  level:
    org.springframework.cloud.gateway: DEBUG
    com.ekyc.api.gateway: DEBUG
    org.springframework.cloud.netflix.eureka: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
```

## 🛣️ Route Configuration

### Service Routes
The API Gateway routes requests to different microservices based on URL patterns:

| Service | Gateway Path | Service Path | Description |
|---------|--------------|--------------|-------------|
| Auth Service | `/api/auth/**` | `/api/auth/**` | Authentication endpoints |
| User Service | `/api/users/**` | `/api/users/**` | User management |
| Tenant Service | `/api/tenants/**` | `/api/tenants/**` | Tenant management |
| Module Service | `/api/modules/**` | `/api/modules/**` | Module management |
| Subscription Service | `/api/subscriptions/**` | `/api/subscriptions/**` | Billing & subscriptions |
| Registry Service | `/api/registry/**` | `/api/registry/**` | Role management |
| Keycloak Sync Service | `/api/keycloak-sync/**` | `/api/keycloak-sync/**` | Keycloak synchronization |

### Health Check Route
```yaml
- id: health-check
  uri: http://localhost:9080
  predicates:
    - Path=/health
  filters:
    - RewritePath=/health, /actuator/health
```

## 🔧 Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `SERVER_PORT` | 9080 | Gateway port |
| `EUREKA_ENABLED` | true | Enable Eureka client |
| `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` | http://localhost:8761/eureka/ | Eureka server URL |

## 📊 Monitoring & Health

### Health Check Endpoints
- **Gateway Health**: `http://localhost:9080/actuator/health`
- **Gateway Routes**: `http://localhost:9080/actuator/gateway/routes`
- **Gateway Info**: `http://localhost:9080/actuator/info`
- **Simplified Health**: `http://localhost:9080/health`

### Metrics Available
- **Request Count**: Number of requests processed
- **Response Time**: Average response times
- **Error Rate**: Percentage of failed requests
- **Route Statistics**: Per-route metrics

## 🔄 Service Dependencies

### Dependencies
- **Eureka Server** - For service discovery and registration

### Dependents
- **All Client Applications** - Frontend portals and external clients
- **All Microservices** - Receive routed requests from gateway

## 🚀 Deployment

### Docker Configuration
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/api-gateway.jar app.jar
EXPOSE 9080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Docker Compose
```yaml
api-gateway:
  build: ./api-gateway
  ports:
    - "9080:9080"
  environment:
    - EUREKA_ENABLED=true
    - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
  depends_on:
    - eureka-server
```

## 🔍 Troubleshooting

### Common Issues

1. **Service Not Found**
   - Check if target service is registered with Eureka
   - Verify route configuration
   - Check service health status

2. **Timeout Issues**
   - Review service response times
   - Check network connectivity
   - Verify service instance availability

3. **CORS Issues**
   - Check CORS configuration
   - Verify allowed origins
   - Review preflight request handling

### Logs to Monitor
```bash
# Gateway logs
docker logs api-gateway

# Route access logs
grep "gateway" application.log

# Service discovery logs
grep "eureka" application.log
```

## 📈 Performance Considerations

### Optimization Tips
- **Connection Pooling**: Configure connection pools for downstream services
- **Caching**: Implement response caching for static content
- **Rate Limiting**: Configure rate limits per service
- **Circuit Breaker**: Implement circuit breakers for fault tolerance

### Scaling Considerations
- **Horizontal Scaling**: Deploy multiple gateway instances
- **Load Balancing**: Use external load balancer for gateway instances
- **Caching**: Implement distributed caching
- **Monitoring**: Comprehensive metrics and alerting

## 🔐 Security

### Security Features
- **Authentication**: JWT token validation
- **Authorization**: Role-based access control
- **Rate Limiting**: Request rate control
- **CORS**: Cross-origin request handling
- **SSL/TLS**: HTTPS termination

### Security Configuration
```yaml
# Example security configuration
spring:
  cloud:
    gateway:
      default-filters:
        - DedupeResponseHeader=Access-Control-Allow-Credentials Access-Control-Allow-Origin
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: "*"
            allowedMethods: "*"
            allowedHeaders: "*"
```

## 🧪 Testing

### Health Check Commands
```bash
# Gateway health
curl http://localhost:9080/actuator/health

# Route information
curl http://localhost:9080/actuator/gateway/routes

# Service routing test
curl http://localhost:9080/api/auth/health
curl http://localhost:9080/api/users/health
```

### Load Testing
```bash
# Test gateway performance
ab -n 1000 -c 10 http://localhost:9080/api/auth/health
```

## 📚 Related Documentation

- [Eureka Server](./eureka-server.md) - Service discovery dependency
- [Auth Service](./auth-service.md) - Authentication endpoints
- [User Service](./user-service.md) - User management endpoints
- [Tenant Service](./tenant-service.md) - Tenant management endpoints
- [Microservices Architecture](../architecture/microservices-design.md) - Overall architecture

---

*Last Updated: [Current Date]*  
*Service Version: 1.0.0* 