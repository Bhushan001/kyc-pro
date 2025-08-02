# Kyc-Pro Platform

A comprehensive multi-tenant KYC (Know Your Customer) platform with role-based access control and modular architecture.

## 🏗️ Architecture Overview

### Backend (Microservices)
- **Eureka Server** (Port 8761) - Service discovery and registration
- **API Gateway** (Port 8080) - Central routing and load balancing
- **Auth Service** (Port 8081) - Authentication & authorization
- **Tenant Service** (Port 8082) - Multi-tenant management
- **User Service** (Port 8083) - User management
- **Module Service** (Port 8084) - Business module management
- **Subscription Service** (Port 8085) - Billing & subscriptions

### Frontend (Multi-Portal Architecture)
- **Kyc-Pro Portal** - Landing page, login, signup
- **Hub Portal** - Platform admin interface
- **Console Portal** - Tenant admin interface
- **Workspace Portal** - User workspace interface

### Database
- **PostgreSQL** with Row Level Security (RLS)
- Multi-tenant data isolation
- Schema-based separation (auth, core, billing)

## 👥 User Flow & Role-Based Access

### User Registration Flow
1. **Landing Page** - Users land on the parent portal homepage
2. **Signup Process** - Users can sign up with the following information:
   - First Name
   - Last Name
   - Email
   - Date of Birth
   - Country
   - Password
   - Role Selection (Platform Admin, Tenant Admin, User)
   - Terms & Conditions acceptance (mandatory)

3. **Role-Based Portal Routing**:
   - **Platform Admin** → Hub Portal (platform management)
   - **Tenant Admin** → Console Portal (organization management)
   - **User** → Workspace Portal (feature usage)

### Role Definitions
- **Platform Admin**: Manages the entire platform, views analytics, oversees all tenants
- **Tenant Admin**: Manages their organization, users, and subscriptions within their tenant
- **User**: Uses platform features, manages tasks, collaborates with team

## 🚀 Quick Start

### 1. Environment Setup

First, set up your environment configuration:

```bash
cd backend

# Interactive setup (recommended)
./setup-env.sh

# Or manual setup
cp env.example .env
# Edit .env file with your preferred values
```

### 2. Start Infrastructure Services

```bash
cd backend
docker-compose up -d
```

This will start:
- **PostgreSQL** on port `5432`
- **Keycloak** on port `8080`

### 3. Build All Services

Build all Java services using the provided script:

```bash
cd backend
./build_all.sh
```

This will build all services in the correct order (common project first, then microservices).

Alternatively, build individual services:

```bash
cd backend/common
mvn clean install

cd ../eureka-server
mvn clean install

# ... repeat for other services
```

### 4. Build Docker Images (Optional)

Build Docker images for all services:

```bash
cd backend
./build_all_docker_images.sh
```

This will create Docker images for all services using their Dockerfiles.

### 5. Run Services

**Backend Microservices** (run in your IDE):
- Eureka Server (Port 8761)
- Auth Service (Port 8081)
- Tenant Service (Port 8082)
- User Service (Port 8083)
- Module Service (Port 8084)
- Subscription Service (Port 8085)
- API Gateway (Port 8086)

**Frontend Portals**:
```bash
# Kyc-Pro Portal (Landing/Login/Signup)
cd frontend/kyc-pro && npm start

# Hub Portal (Platform Admin)
cd frontend/hub-portal && npm start

# Console Portal (Tenant Admin)
cd frontend/console-portal && npm start

# Workspace Portal (User)
cd frontend/workspace-portal && npm start
```

## 📋 Features Implemented

### ✅ Completed
- [x] Multi-tenant database schema with RLS
- [x] User registration with role selection
- [x] Terms & conditions acceptance
- [x] Role-based portal routing
- [x] Modern responsive UI with Tailwind CSS
- [x] JWT-based authentication
- [x] Microservices architecture
- [x] Docker containerization
- [x] Environment configuration system
- [x] Common project with shared components

### 🔄 In Progress
- [ ] Complete service implementations
- [ ] Portal-specific features
- [ ] Subscription management
- [ ] Module management
- [ ] User management within tenants

## 📚 Documentation

### ☕ Java Development Kit (JDK) Setup

This project requires **Java 21** (JDK 21). Follow these steps to set up JDK 21 as your default Java version.

#### Installing JDK 21

**Option 1: Using Homebrew (Recommended)**

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to PATH (for Apple Silicon Macs)
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Install JDK 21
brew install openjdk@21

# Create a symbolic link to make it the default
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk
```

**Option 2: Download from Oracle**

1. Visit [Oracle JDK 21 Downloads](https://www.oracle.com/java/technologies/downloads/#java21)
2. Download the appropriate version for your OS
3. Install the downloaded package

#### Setting JDK 21 as Default

Add the following to your shell configuration file (`~/.zshrc` for zsh or `~/.bash_profile` for bash):

```bash
# Set JAVA_HOME to JDK 21
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home

# Add Java binaries to PATH
export PATH="$JAVA_HOME/bin:$PATH"

# Add Homebrew to PATH (if using Homebrew)
export PATH="/opt/homebrew/bin:$PATH"
```

#### Verifying the Setup

After setting up JDK 21, verify the installation:

```bash
# Check Java version
java -version

# Should output something like:
# java version "21.0.2" 2024-01-16 LTS
# Java(TM) SE Runtime Environment (build 21.0.2+13-LTS-58)
# Java HotSpot(TM) 64-Bit Server VM (build 21.0.2+13-LTS-58, mixed mode, sharing)

# Check JAVA_HOME
echo $JAVA_HOME

# Should output:
# /Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home

# Check Maven is using Java 21
mvn -version

# Should show Java version: 21.x.x
```

#### Troubleshooting

**If Java version is still showing an older version:**

1. **Check which Java is being used:**
   ```bash
   which java
   ```

2. **List all installed Java versions:**
   ```bash
   /usr/libexec/java_home -V
   ```

3. **Manually set JAVA_HOME for the current session:**
   ```bash
   export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home
   export PATH="$JAVA_HOME/bin:$PATH"
   ```

**If Maven is not found:**

1. **Install Maven:**
   ```bash
   brew install maven
   ```

2. **Verify Maven installation:**
   ```bash
   mvn -version
   ```

#### IDE Configuration

**IntelliJ IDEA**
1. Open **Preferences/Settings** → **Build, Execution, Deployment** → **Build Tools** → **Maven**
2. Set **Maven home path** to your Maven installation
3. Set **JDK for importer** to JDK 21

**Eclipse**
1. Go to **Window** → **Preferences** → **Java** → **Installed JREs**
2. Add JDK 21 and set it as default
3. Go to **Window** → **Preferences** → **Java** → **Compiler**
4. Set **Compiler compliance level** to 21

**VS Code**
1. Install the **Extension Pack for Java**
2. Set `java.home` in settings to your JDK 21 path
3. Reload VS Code

### 🚀 Development Environment Setup

#### Prerequisites

- **Docker & Docker Compose** installed and running
- **Java 21** installed (required for this project)
- **Maven** installed
- **Node.js 18+** and **npm** installed
- **IntelliJ IDEA** or your preferred IDE

#### Environment Setup

First, set up your environment configuration:

```bash
cd backend

# Option 1: Interactive setup (recommended)
./setup-env.sh

# Option 2: Manual setup
cp env.example .env
# Edit .env file with your preferred values
```

The interactive setup will prompt you for:
- **Database configuration** (PostgreSQL settings)
- **Keycloak configuration** (admin credentials, realm settings)
- **Security settings** (JWT secret, password policies)
- **Development settings** (logging, features)
- **External services** (email, storage, payments) - optional

#### Start Infrastructure Services

Start PostgreSQL and Keycloak with your configured settings:

```bash
cd backend
docker-compose up -d
```

This will start:
- **PostgreSQL** on port `5432` (or your configured port)
- **Keycloak** on port `8080` (or your configured port)

#### Verify Services are Running

```bash
# Check running containers
docker ps

# Check logs
docker-compose logs postgres
docker-compose logs keycloak
```

#### Access Services

- **PostgreSQL**: `localhost:5432` (or your configured port)
  - Database: `ekyc_platform` (or your configured database)
  - Username: `saas_user` (or your configured username)
  - Password: `saas_password` (or your configured password)

- **Eureka Server**: `http://localhost:8761` (or your configured port)
  - Dashboard: `http://localhost:8761`
  - Service Registry: `http://localhost:8761/eureka/apps`

- **Keycloak**: `http://localhost:8080` (or your configured port)
  - Admin Console: `http://localhost:8080/admin`
  - Username: `admin` (or your configured admin username)
  - Password: `admin123` (or your configured admin password)

### 🏗️ Backend Services Architecture

#### Services Overview

**Infrastructure Services:**
- **Eureka Server** (`eureka-server/`) - Service discovery and registration
- **API Gateway** (`api-gateway/`) - Central routing and load balancing

**Business Services:**
- **Auth Service** (`auth-service/`) - Authentication and authorization
- **Tenant Service** (`tenant-service/`) - Multi-tenant management
- **User Service** (`user-service/`) - User management
- **Module Service** (`module-service/`) - Business module management
- **Subscription Service** (`subscription-service/`) - Billing and subscriptions

**Shared Components:**
- **Common Project** (`common/`) - Shared DTOs, exceptions, and utilities

#### Build Scripts

**`build_all.sh`**
Builds all Java services using Maven.

**Features:**
- Builds common project first (required dependency)
- Builds all microservices in parallel
- Shows build status and results
- Provides next steps guidance

**Usage:**
```bash
./build_all.sh
```

**`build_all_docker_images.sh`**
Builds Docker images for all services.

**Features:**
- Checks if services are built (runs build_all.sh if needed)
- Builds Docker images using Dockerfiles
- Configurable registry and tag
- Shows build results and image details

**Usage:**
```bash
# Default settings
./build_all_docker_images.sh

# Custom registry and tag
./build_all_docker_images.sh -r myregistry -t v1.0.0

# Environment variables
DOCKER_REGISTRY=myregistry DOCKER_TAG=v1.0.0 ./build_all_docker_images.sh
```

**Options:**
- `-r, --registry REGISTRY` - Docker registry (default: ekyc)
- `-t, --tag TAG` - Docker tag (default: latest)
- `-h, --help` - Show help message

#### Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Eureka Server | 8761 | Service discovery |
| API Gateway | 8080 | Central routing |
| Auth Service | 8081 | Authentication |
| Tenant Service | 8082 | Tenant management |
| User Service | 8083 | User management |
| Module Service | 8084 | Module management |
| Subscription Service | 8085 | Billing |

#### Docker Images

After building, the following Docker images will be available:

- `ekyc/eureka-server:latest`
- `ekyc/auth-service:latest`
- `ekyc/tenant-service:latest`
- `ekyc/user-service:latest`
- `ekyc/module-service:latest`
- `ekyc/subscription-service:latest`
- `ekyc/api-gateway:latest`

#### Monitoring

- **Eureka Dashboard**: http://localhost:8761
- **API Gateway**: http://localhost:8080
- **Service Health**: http://localhost:8080/actuator/health

### 🔧 Common Project

Shared components for the Kyc-Pro Platform microservices architecture.

#### Project Structure

```
src/main/java/com/saasplatform/common/
├── constants/
│   ├── MessageCodes.java      # Error and success codes (KP-01 to KP-99)
│   └── MessageTexts.java      # User-friendly messages mapped to codes
├── dto/
│   ├── ApiResponse.java       # Standardized API response wrapper
│   ├── UserDto.java          # Shared user DTO
│   ├── TenantDto.java        # Shared tenant DTO
│   ├── ModuleDto.java        # Shared module DTO
│   └── SubscriptionDto.java  # Shared subscription DTO
├── exception/
│   ├── SaaSPlatformException.java    # Base exception class
│   ├── UserNotFoundException.java     # User not found exception
│   ├── UserAlreadyExistsException.java # User already exists exception
│   ├── InvalidCredentialsException.java # Invalid credentials exception
│   └── ValidationException.java       # Validation failure exception
├── util/
│   └── ValidationUtils.java   # Common validation utilities
└── SharedDto.java            # Base DTO with common fields
```

#### Components

**Message Codes & Texts**

**MessageCodes.java**
Contains all error and success codes for the platform:
- **Success Codes**: KP-01 to KP-49
- **Error Codes**: KP-50 to KP-99

```java
// Usage
throw new UserNotFoundException(MessageCodes.ERROR_USER_NOT_FOUND);
```

**MessageTexts.java**
Maps message codes to user-friendly messages:

```java
// Usage
String message = MessageTexts.getMessage(MessageCodes.ERROR_USER_NOT_FOUND);
// Returns: "User not found"
```

**DTOs (Data Transfer Objects)**

**ApiResponse.java**
Standardized API response wrapper for all services:

```java
// Success response
ApiResponse<UserDto> response = ApiResponse.success(MessageCodes.SUCCESS_USER_CREATED, userDto);

// Error response
ApiResponse<Void> response = ApiResponse.error(MessageCodes.ERROR_USER_NOT_FOUND);
```

**UserDto.java**
Shared user DTO with all user-related fields and utility methods:

```java
UserDto user = new UserDto();
user.setEmail("user@example.com");
user.setFirstname("John");
user.setLastname("Doe");

// Utility methods
String fullName = user.getFullName(); // "John Doe"
boolean isAdmin = user.isPlatformAdmin();
boolean isActive = user.isActive();
```

**TenantDto.java**
Shared tenant DTO with tenant management fields:

```java
TenantDto tenant = new TenantDto();
tenant.setName("Acme Corp");
tenant.setDomain("acme.com");
tenant.setPlan("business");

// Utility methods
boolean isActive = tenant.isActive();
boolean isEnterprise = tenant.isEnterprisePlan();
```

**ModuleDto.java**
Shared module DTO for business modules:

```java
ModuleDto module = new ModuleDto();
module.setName("Task Management");
module.setCategory("Productivity");
module.setMonthlyPrice(new BigDecimal("19.99"));

// Utility methods
boolean isActive = module.isActive();
boolean hasFeature = module.hasFeature("Drag and Drop");
BigDecimal price = module.getPrice("yearly");
```

**SubscriptionDto.java**
Shared subscription DTO for billing:

```java
SubscriptionDto subscription = new SubscriptionDto();
subscription.setTenantId(tenantId);
subscription.setModuleId(moduleId);
subscription.setBillingCycle("monthly");

// Utility methods
boolean isActive = subscription.isActive();
boolean isExpired = subscription.isExpired();
boolean isExpiringSoon = subscription.isExpiringSoon();
```

**Exceptions**

**SaaSPlatformException.java**
Base exception class with error codes and user messages:

```java
// Basic usage
throw new SaaSPlatformException(MessageCodes.ERROR_USER_NOT_FOUND);

// With custom message
throw new SaaSPlatformException(MessageCodes.ERROR_USER_NOT_FOUND, "User not found in database");

// With cause
throw new SaaSPlatformException(MessageCodes.ERROR_DATABASE_CONNECTION, "Database error", cause);
```

**Specific Exceptions**
- `UserNotFoundException` - When user is not found
- `UserAlreadyExistsException` - When user already exists
- `InvalidCredentialsException` - When login credentials are invalid
- `ValidationException` - When validation fails

**Validation Utils**

**ValidationUtils.java**
Common validation utilities for all services:

```java
// Email validation
ValidationUtils.validateEmail("user@example.com");

// Password validation
ValidationUtils.validatePassword("password123");

// Required field validation
ValidationUtils.validateRequired(email, "email");

// Role validation
ValidationUtils.validateRole("platform_admin");

// Terms acceptance validation
ValidationUtils.validateTermsAccepted("true");
```

#### Integration

**Adding to Other Services**

1. **Add dependency to pom.xml**:
```xml
<dependency>
    <groupId>com.saasplatform</groupId>
    <artifactId>common</artifactId>
    <version>1.0.0</version>
</dependency>
```

2. **Import and use components**:
```java
import com.saasplatform.common.constants.MessageCodes;
import com.saasplatform.common.dto.ApiResponse;
import com.saasplatform.common.exception.UserNotFoundException;
import com.saasplatform.common.util.ValidationUtils;

@Service
public class UserService {
    
    public ApiResponse<UserDto> createUser(UserDto userDto) {
        try {
            // Validate input
            ValidationUtils.validateEmail(userDto.getEmail());
            ValidationUtils.validatePassword(userDto.getPassword());
            ValidationUtils.validateRequired(userDto.getFirstname(), "firstname");
            
            // Business logic...
            
            return ApiResponse.success(MessageCodes.SUCCESS_USER_CREATED, userDto);
        } catch (Exception e) {
            return ApiResponse.error(MessageCodes.ERROR_USER_ALREADY_EXISTS);
        }
    }
}
```

**Controller Usage**

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @PostMapping
    public ResponseEntity<ApiResponse<UserDto>> createUser(@RequestBody UserDto userDto) {
        try {
            // Validation and business logic
            UserDto createdUser = userService.createUser(userDto);
            return ResponseEntity.ok(ApiResponse.success(MessageCodes.SUCCESS_USER_CREATED, createdUser));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getErrorCode(), e.getUserMessage()));
        } catch (ValidationException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getErrorCode(), e.getUserMessage()));
        }
    }
}
```

#### Message Code Reference

**Success Codes (KP-01 to KP-49)**
- `KP-01` - User created successfully
- `KP-02` - User updated successfully
- `KP-03` - User deleted successfully
- `KP-04` - Login successful
- `KP-05` - Logout successful
- `KP-06` - Tenant created successfully
- `KP-07` - Tenant updated successfully
- `KP-08` - Tenant deleted successfully
- `KP-09` - Module created successfully
- `KP-10` - Module updated successfully
- `KP-11` - Module deleted successfully
- `KP-12` - Subscription created successfully
- `KP-13` - Subscription updated successfully
- `KP-14` - Subscription cancelled successfully
- `KP-15` - Password changed successfully
- `KP-16` - Email verified successfully
- `KP-17` - Profile updated successfully
- `KP-18` - Role assigned successfully
- `KP-19` - Role removed successfully
- `KP-20` - Tenant activated successfully
- `KP-21` - Tenant deactivated successfully
- `KP-22` - Module activated successfully
- `KP-23` - Module deactivated successfully
- `KP-24` - Subscription renewed successfully
- `KP-25` - Payment processed successfully

**Error Codes (KP-50 to KP-99)**
- `KP-50` - User not found
- `KP-51` - User already exists
- `KP-52` - Invalid credentials
- `KP-53` - Invalid token
- `KP-54` - Token expired
- `KP-55` - Insufficient permissions
- `KP-56` - Tenant not found
- `KP-57` - Tenant already exists
- `KP-58` - Tenant inactive
- `KP-59` - Module not found
- `KP-60` - Module already exists
- `KP-61` - Module inactive
- `KP-62` - Subscription not found
- `KP-63` - Subscription already exists
- `KP-64` - Subscription expired
- `KP-65` - Payment failed
- `KP-66` - Invalid email format
- `KP-67` - Invalid password format
- `KP-68` - Invalid date format
- `KP-69` - Required field missing
- `KP-70` - Terms not accepted
- `KP-71` - Email not verified
- `KP-72` - Account locked
- `KP-73` - Account disabled
- `KP-74` - Rate limit exceeded
- `KP-75` - Database connection error
- `KP-76` - External service unavailable
- `KP-77` - Invalid request data
- `KP-78` - Validation failed
- `KP-79` - Internal server error
- `KP-80` - Service unavailable
- `KP-81` - Bad request
- `KP-82` - Unauthorized
- `KP-83` - Forbidden
- `KP-84` - Not found
- `KP-85` - Method not allowed
- `KP-86` - Conflict
- `KP-87` - Unsupported media type
- `KP-88` - Too many requests
- `KP-89` - Gateway timeout
- `KP-90` - Invalid role
- `KP-91` - Invalid tenant
- `KP-92` - Invalid module
- `KP-93` - Invalid subscription
- `KP-94` - Invalid user
- `KP-95` - Invalid operation
- `KP-96` - Data integrity violation
- `KP-97` - Constraint violation
- `KP-98` - Duplicate key
- `KP-99` - Unknown error

### 🔍 Eureka Service Discovery

#### Overview

Eureka Server provides service discovery and registration for the Kyc-Pro Platform microservices architecture. It allows services to find and communicate with each other dynamically without hard-coded URLs.

#### Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │  Auth Service   │    │ Tenant Service  │
│   (Port 8080)   │    │   (Port 8081)   │    │   (Port 8082)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Eureka Server  │
                    │   (Port 8761)   │
                    └─────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  User Service   │    │ Module Service  │    │Subscription Svc │
│   (Port 8083)   │    │   (Port 8084)   │    │   (Port 8085)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Configuration

**Eureka Server**

**Location**: `backend/eureka-server/`

**Key Configuration** (`application.yml`):
```yaml
server:
  port: 8761

eureka:
  instance:
    hostname: localhost
    prefer-ip-address: true
  client:
    register-with-eureka: false  # Server doesn't register itself
    fetch-registry: false        # Server doesn't fetch registry
    service-url:
      defaultZone: http://localhost:8761/eureka/
  server:
    enable-self-preservation: false
    eviction-interval-timer-in-ms: 1000
    wait-time-in-ms-when-sync-empty: 0
```

**Eureka Clients**

All microservices are configured as Eureka clients with:

```yaml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true
    instance-id: ${spring.application.name}:${server.port}
```

#### Service Registration

**Registered Services**

1. **auth-service** (Port 8081)
   - Authentication and authorization
   - JWT token management
   - User registration and login

2. **tenant-service** (Port 8082)
   - Multi-tenant management
   - Tenant CRUD operations
   - Tenant configuration

3. **user-service** (Port 8083)
   - User management
   - User CRUD operations
   - User profile management

4. **module-service** (Port 8084)
   - Business module management
   - Module CRUD operations
   - Feature management

5. **subscription-service** (Port 8085)
   - Billing and subscriptions
   - Subscription management
   - Payment processing

6. **api-gateway** (Port 8080)
   - Central routing
   - Load balancing
   - Service discovery integration

#### API Gateway Integration

The API Gateway uses Eureka for service discovery:

```yaml
spring:
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true
      routes:
        - id: auth
          uri: lb://auth-service          # Load balancer with service discovery
          predicates: [ Path=/api/auth/** ]
        - id: tenant
          uri: lb://tenant-service        # Load balancer with service discovery
          predicates: [ Path=/api/tenants/** ]
        # ... other routes
```

#### Benefits

**1. Dynamic Service Discovery**
- Services register themselves with Eureka
- No hard-coded service URLs
- Automatic health checking

**2. Load Balancing**
- API Gateway uses `lb://` protocol
- Automatic load balancing across service instances
- Health-based routing

**3. Fault Tolerance**
- Service health monitoring
- Automatic service removal on failure
- Self-healing capabilities

**4. Scalability**
- Easy to add new service instances
- Automatic service registration
- No configuration changes needed

#### Monitoring

**Eureka Dashboard**
- **URL**: `http://localhost:8761`
- **Features**:
  - View all registered services
  - Service health status
  - Instance details
  - Service metadata

**Service Registry API**
- **URL**: `http://localhost:8761/eureka/apps`
- **Format**: JSON
- **Use**: Programmatic access to service registry

#### Health Checks

Eureka automatically monitors service health:

1. **Heartbeat**: Services send periodic heartbeats
2. **Health Endpoint**: `/actuator/health` endpoint monitoring
3. **Eviction**: Unhealthy services are automatically removed
4. **Re-registration**: Services re-register when they recover

#### Development Workflow

**1. Start Eureka Server**
```bash
cd backend/eureka-server
mvn spring-boot:run
```

**2. Start Microservices**
Start services in any order - they will automatically register with Eureka.

**3. Monitor Services**
- Check Eureka dashboard: `http://localhost:8761`
- Verify all services are registered
- Monitor service health

**4. Test Service Discovery**
- API Gateway will automatically route to healthy services
- Services can discover each other using service names
- Load balancing works automatically

#### Troubleshooting

**Common Issues**

1. **Service Not Registering**
   - Check Eureka server is running
   - Verify service configuration
   - Check network connectivity

2. **Service Not Found**
   - Verify service is registered in Eureka
   - Check service health status
   - Verify service name in API Gateway routes

3. **Connection Issues**
   - Check Eureka server port (8761)
   - Verify firewall settings
   - Check service URLs in configuration

**Debug Commands**

```bash
# Check Eureka server status
curl http://localhost:8761/actuator/health

# View service registry
curl http://localhost:8761/eureka/apps

# Check specific service
curl http://localhost:8761/eureka/apps/AUTH-SERVICE
```

#### Production Considerations

**1. High Availability**
- Deploy multiple Eureka server instances
- Configure peer-to-peer communication
- Use load balancer for Eureka access

**2. Security**
- Enable HTTPS for Eureka communication
- Implement authentication for Eureka dashboard
- Secure service-to-service communication

**3. Monitoring**
- Set up alerts for service failures
- Monitor Eureka server health
- Track service registration/deregistration events

**4. Performance**
- Configure appropriate heartbeat intervals
- Tune eviction timers
- Monitor memory usage

#### Configuration Reference

**Environment Variables**

| Variable | Default | Description |
|----------|---------|-------------|
| `EUREKA_SERVER_PORT` | `8761` | Eureka Server port |
| `EUREKA_CLIENT_SERVICE_URL` | `http://localhost:8761/eureka/` | Eureka server URL |

**Service Configuration**

Each service includes:
- Eureka client dependency
- Service registration configuration
- Health check endpoints
- Instance metadata 