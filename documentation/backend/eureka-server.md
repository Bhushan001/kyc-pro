# Eureka Server

## 📋 Service Overview

**Service Name**: Eureka Server  
**Port**: 8761  
**Application Name**: `eureka-server`  
**Health Check**: http://localhost:8761/actuator/health  
**Dashboard**: http://localhost:8761

## 🎯 Purpose & Functionality

The Eureka Server is the **service discovery and registration center** for the KYC-Pro microservices architecture. It acts as a central registry where all microservices register themselves and discover other services they need to communicate with.

### Key Responsibilities:
- **Service Registration**: All microservices register their instances with Eureka
- **Service Discovery**: Services can discover and locate other services dynamically
- **Load Balancing**: Provides client-side load balancing capabilities
- **Health Monitoring**: Tracks service health and availability
- **Service Registry**: Maintains a registry of all available service instances

## ⚙️ Configuration Details

### Server Configuration
```yaml
server:
  port: 8761
```

### Spring Application Configuration
```yaml
spring:
  application:
    name: eureka-server
  profiles:
    active: dev
```

### Eureka Server Configuration
```yaml
eureka:
  instance:
    hostname: localhost
    prefer-ip-address: true
  client:
    register-with-eureka: false    # Server doesn't register itself
    fetch-registry: false          # Server doesn't fetch registry
    service-url:
      defaultZone: http://localhost:8761/eureka/
  server:
    enable-self-preservation: false    # Disabled for development
    eviction-interval-timer-in-ms: 1000
    wait-time-in-ms-when-sync-empty: 0
```

### Management Endpoints
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,eureka
  endpoint:
    health:
      show-details: always
```

### Logging Configuration
```yaml
logging:
  level:
    com.netflix.eureka: DEBUG
    com.netflix.discovery: DEBUG
```

## 🏗️ Architecture

### Service Registration Flow
1. **Service Startup**: When a microservice starts, it registers with Eureka
2. **Heartbeat**: Services send periodic heartbeats to maintain registration
3. **Registry Update**: Eureka updates its registry with service information
4. **Service Discovery**: Other services can discover registered services

### Service Discovery Flow
1. **Client Request**: Service needs to communicate with another service
2. **Registry Lookup**: Client queries Eureka for service instances
3. **Load Balancing**: Eureka returns available instances
4. **Service Call**: Client makes the actual service call

## 🔧 Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `SERVER_PORT` | 8761 | Server port |
| `SPRING_PROFILES_ACTIVE` | dev | Active Spring profile |

## 📊 Monitoring & Health

### Health Check Endpoints
- **Health Check**: `http://localhost:8761/actuator/health`
- **Info Endpoint**: `http://localhost:8761/actuator/info`
- **Eureka Dashboard**: `http://localhost:8761`

### Dashboard Features
- **Service Registry**: View all registered services
- **Instance Details**: Service instance information
- **Health Status**: Service health monitoring
- **Load Balancing**: Instance distribution

## 🔄 Service Dependencies

### Dependencies
- **None** - Eureka Server is the foundation service

### Dependents
- **API Gateway** - Uses Eureka for service discovery
- **All Microservices** - Register with and discover through Eureka

## 🚀 Deployment

### Docker Configuration
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/eureka-server.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Docker Compose
```yaml
eureka-server:
  build: ./eureka-server
  ports:
    - "8761:8761"
  environment:
    - SPRING_PROFILES_ACTIVE=dev
```

## 🔍 Troubleshooting

### Common Issues

1. **Service Not Registering**
   - Check if Eureka Server is running on port 8761
   - Verify service configuration includes Eureka client settings
   - Check network connectivity between service and Eureka

2. **Service Discovery Issues**
   - Verify service is properly registered in Eureka dashboard
   - Check service health status
   - Review Eureka client configuration

3. **High Memory Usage**
   - Monitor Eureka server memory usage
   - Consider adjusting JVM heap settings
   - Review service registration frequency

### Logs to Monitor
```bash
# Eureka Server logs
docker logs eureka-server

# Service registration logs
grep "eureka" application.log
```

## 📈 Performance Considerations

### Optimization Tips
- **Self-Preservation**: Disabled in development, enable in production
- **Eviction Timer**: Adjust based on service count and network stability
- **Heartbeat Frequency**: Balance between responsiveness and network load
- **Registry Size**: Monitor registry size for large deployments

### Scaling Considerations
- **Multiple Instances**: Run multiple Eureka instances for high availability
- **Load Balancing**: Use load balancer for Eureka client connections
- **Network Partitioning**: Handle network partitions gracefully

## 🔐 Security

### Security Considerations
- **Network Security**: Restrict access to Eureka dashboard in production
- **Authentication**: Consider adding authentication for Eureka dashboard
- **HTTPS**: Use HTTPS for production deployments
- **Firewall Rules**: Configure firewall to allow only necessary connections

## 📚 Related Documentation

- [API Gateway](./api-gateway.md) - Uses Eureka for service discovery
- [Microservices Architecture](../architecture/microservices-design.md) - Overall architecture
- [Service Communication](../architecture/service-communication.md) - How services communicate

---

*Last Updated: [Current Date]*  
*Service Version: 1.0.0* 