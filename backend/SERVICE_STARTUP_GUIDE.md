# Service Startup Guide

## 🚀 **Kyc-Pro Platform Service Startup Sequence**

This guide provides the correct order and detailed instructions for starting all services in the Kyc-Pro platform.

### **📋 Prerequisites**

Before starting services, ensure you have:
- ✅ **Java 21** installed and configured
- ✅ **Maven** installed and configured
- ✅ **PostgreSQL** running on port 5432
- ✅ **Keycloak** running on port 8080
- ✅ **Node.js** and **Angular CLI** (for frontend)

### **🔧 Infrastructure Services (Start First)**

#### **1. PostgreSQL Database**
```bash
# If using Docker
docker run --name postgres-ekyc \
  -e POSTGRES_DB=ekyc_platform \
  -e POSTGRES_USER=saas_user \
  -e POSTGRES_PASSWORD=saas_password \
  -p 5432:5432 \
  -d postgres:15

# Or if using local PostgreSQL
# Ensure PostgreSQL is running on port 5432
```

#### **2. Keycloak Identity Provider**
```bash
# If using Docker
docker run --name keycloak-ekyc \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin123 \
  -e KC_DB=postgres \
  -e KC_DB_URL=jdbc:postgresql://localhost:5432/keycloak \
  -e KC_DB_USERNAME=saas_user \
  -e KC_DB_PASSWORD=saas_password \
  -p 8080:8080 \
  -d quay.io/keycloak/keycloak:latest start-dev
```

### **🔍 Service Discovery (Start Second)**

#### **3. Eureka Server (Port 8761)**
```bash
cd backend/eureka-server
mvn spring-boot:run
```
**Verification**: http://localhost:8761
- Should show Eureka dashboard
- No services registered yet

### **🏗️ Core Microservices (Start Third)**

#### **4. User Service (Port 9082)**
```bash
cd backend/user-service
mvn spring-boot:run
```
**Verification**: 
- Check Eureka: http://localhost:8761 (should show user-service)
- Health check: http://localhost:9082/actuator/health

#### **5. Tenant Service (Port 9083)**
```bash
cd backend/tenant-service
mvn spring-boot:run
```
**Verification**:
- Check Eureka: http://localhost:8761 (should show tenant-service)
- Health check: http://localhost:9083/actuator/health

#### **6. Registry Service (Port 9087)**
```bash
cd backend/registry-service
mvn spring-boot:run
```
**Verification**:
- Check Eureka: http://localhost:8761 (should show registry-service)
- Health check: http://localhost:9087/actuator/health

#### **7. Keycloak Sync Service (Port 9086)**
```bash
cd backend/keycloak-sync-service
mvn spring-boot:run
```
**Verification**:
- Check Eureka: http://localhost:8761 (should show keycloak-sync-service)
- Health check: http://localhost:9086/actuator/health

#### **8. Module Service (Port 9084)**
```bash
cd backend/module-service
mvn spring-boot:run
```
**Verification**:
- Check Eureka: http://localhost:8761 (should show module-service)
- Health check: http://localhost:9084/actuator/health

#### **9. Subscription Service (Port 9085)**
```bash
cd backend/subscription-service
mvn spring-boot:run
```
**Verification**:
- Check Eureka: http://localhost:8761 (should show subscription-service)
- Health check: http://localhost:9085/actuator/health

### **🔐 Authentication Service (Start Fourth)**

#### **10. Auth Service (Port 9081)**
```bash
cd backend/auth-service
mvn spring-boot:run
```
**Verification**:
- Check Eureka: http://localhost:8761 (should show auth-service)
- Health check: http://localhost:9081/actuator/health
- Test signup: POST http://localhost:9080/api/auth/signup

### **🌐 API Gateway (Start Fifth)**

#### **11. API Gateway (Port 9080)**
```bash
cd backend/api-gateway
mvn spring-boot:run
```
**Verification**:
- Check Eureka: http://localhost:8761 (should show api-gateway)
- Health check: http://localhost:9080/actuator/health
- Test gateway: http://localhost:9080/actuator/gateway/routes

### **🎨 Frontend Applications (Start Last)**

#### **12. Kyc-Pro Main Portal (Port 4200)**
```bash
cd frontend/kyc-pro
ng serve
```
**Verification**: http://localhost:4200

#### **13. Hub Portal (Port 4201)**
```bash
cd frontend/hub-portal
ng serve --port 4201
```
**Verification**: http://localhost:4201

#### **14. Console Portal (Port 4202)**
```bash
cd frontend/console-portal
ng serve --port 4202
```
**Verification**: http://localhost:4202

#### **15. Workspace Portal (Port 4203)**
```bash
cd frontend/workspace-portal
ng serve --port 4203
```
**Verification**: http://localhost:4203

### **🔍 Verification Checklist**

#### **✅ Infrastructure**
- [ ] PostgreSQL running on port 5432
- [ ] Keycloak running on port 8080
- [ ] Database accessible

#### **✅ Service Discovery**
- [ ] Eureka Server running on port 8761
- [ ] All services registered in Eureka

#### **✅ Microservices**
- [ ] User Service (9082) - Healthy
- [ ] Tenant Service (9083) - Healthy
- [ ] Registry Service (9087) - Healthy
- [ ] Keycloak Sync Service (9086) - Healthy
- [ ] Module Service (9084) - Healthy
- [ ] Subscription Service (9085) - Healthy
- [ ] Auth Service (9081) - Healthy

#### **✅ Gateway & Frontend**
- [ ] API Gateway (9080) - Healthy
- [ ] All frontend apps accessible
- [ ] CORS working properly

### **🧪 Testing End-to-End**

#### **Test User Signup Flow**
```bash
# Test signup via API Gateway
curl -X POST http://localhost:9080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstname": "John",
    "lastname": "Doe",
    "dateOfBirth": "1990-01-01",
    "country": "US",
    "role": "PLATFORM_ADMIN",
    "termsAccepted": "true"
  }'
```

#### **Test Service Communication**
```bash
# Test user service directly
curl http://localhost:9082/actuator/health

# Test via API Gateway
curl http://localhost:9080/api/users/tenant/22222222-2222-2222-2222-222222222222
```

### **🚨 Troubleshooting**

#### **Common Issues**

**1. Port Already in Use**
```bash
# Check what's using the port
lsof -i :PORT_NUMBER

# Kill the process
kill -9 PID
```

**2. Service Not Registering with Eureka**
- Check if Eureka is running
- Verify service configuration
- Check network connectivity

**3. Database Connection Issues**
- Verify PostgreSQL is running
- Check database credentials
- Ensure database exists

**4. Keycloak Connection Issues**
- Verify Keycloak is running
- Check realm configuration
- Ensure client is configured

**5. CORS Issues**
- Check API Gateway CORS configuration
- Verify frontend URLs are allowed
- Check browser console for errors

#### **Debug Commands**

```bash
# Check all running services
netstat -tulpn | grep :90

# Check Eureka registrations
curl http://localhost:8761/eureka/apps

# Check service health
curl http://localhost:PORT/actuator/health

# Check API Gateway routes
curl http://localhost:9080/actuator/gateway/routes
```

### **📝 Notes**

- **Startup Order**: Infrastructure → Eureka → Microservices → Auth → Gateway → Frontend
- **Dependencies**: Each service depends on the services started before it
- **Health Checks**: Always verify each service is healthy before starting the next
- **Logs**: Monitor logs for any errors during startup
- **Environment**: Ensure all environment variables are set correctly

### **🔄 Restart Sequence**

If you need to restart services:

1. **Stop all services** (Ctrl+C in each terminal)
2. **Stop infrastructure** (Docker containers)
3. **Start infrastructure** (PostgreSQL, Keycloak)
4. **Follow startup sequence** above

### **⚡ Quick Start Script**

For development, you can create a script to start all services:

```bash
#!/bin/bash
# start-services.sh

echo "Starting Kyc-Pro Platform Services..."

# Start infrastructure (if using Docker)
# docker-compose up -d

# Start Eureka
cd backend/eureka-server && mvn spring-boot:run &

# Wait for Eureka
sleep 10

# Start microservices
cd ../user-service && mvn spring-boot:run &
cd ../tenant-service && mvn spring-boot:run &
cd ../registry-service && mvn spring-boot:run &
cd ../keycloak-sync-service && mvn spring-boot:run &
cd ../module-service && mvn spring-boot:run &
cd ../subscription-service && mvn spring-boot:run &

# Wait for microservices
sleep 20

# Start auth service
cd ../auth-service && mvn spring-boot:run &

# Wait for auth service
sleep 10

# Start API Gateway
cd ../api-gateway && mvn spring-boot:run &

echo "All services started!"
```

**Note**: This is a basic script. In production, use proper orchestration tools like Docker Compose or Kubernetes. 