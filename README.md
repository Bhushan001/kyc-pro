# KYC-Pro Platform

A comprehensive multi-tenant KYC (Know Your Customer) platform with role-based access control and modular architecture.

## 📚 Documentation

Comprehensive documentation is available in the [`documentation/`](./documentation/) directory:
- **Backend Services** - Detailed API documentation and service guides
- **Frontend Applications** - Component architecture and development guides
- **Database Schema** - Complete database design and migration guides
- **Infrastructure** - Deployment and configuration guides
- **API Testing** - Postman collections and testing guides

## 🛠️ Technical Stack Overview

### **Backend Architecture**
- **Framework**: Java 21 + Spring Boot 3.4.0 + Spring Cloud 2024.0.2
- **Architecture**: Microservices with Service Discovery (Eureka)
- **API Gateway**: Spring Cloud Gateway with load balancing
- **Database**: PostgreSQL 15 with multi-schema design
- **Authentication**: Keycloak 23.0 + JWT tokens
- **Build Tool**: Maven for dependency management
- **Containerization**: Docker + Docker Compose

### **Frontend Applications**
- **Framework**: Angular (multiple versions for different portals)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **Package Manager**: npm
- **Build Tool**: Angular CLI

### **Infrastructure & DevOps**
- **Containerization**: Docker containers for all services
- **Orchestration**: Docker Compose for local development
- **Service Discovery**: Eureka Server (8761)
- **API Gateway**: Spring Cloud Gateway (9080)
- **Database**: PostgreSQL with multi-schema architecture
- **Identity Management**: Keycloak with custom realm

### **Development Tools**
- **API Testing**: Postman collections with environment configurations
- **Database Management**: PostgreSQL with initialization scripts
- **Health Monitoring**: Spring Boot Actuator endpoints
- **Logging**: SLF4J with structured logging

### **Design System**
- **UI Library**: shadcn/ui components (React TypeScript)
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React icon library
- **Theming**: Light/Dark mode support
- **Accessibility**: ARIA-compliant components

## 🏗️ Architecture Overview

### Backend Services (Microservices)

| Service | Port | Description | Health Check |
|---------|------|-------------|--------------|
| **Eureka Server** | 8761 | Service discovery and registration | http://localhost:8761 |
| **API Gateway** | 9080 | Central routing and load balancing | http://localhost:9080/actuator/health |
| **Auth Service** | 9081 | Authentication & authorization | http://localhost:9081/actuator/health |
| **Tenant Service** | 9082 | Multi-tenant management | http://localhost:9082/actuator/health |
| **User Service** | 9083 | User management | http://localhost:9083/actuator/health |
| **Module Service** | 9084 | Business module management | http://localhost:9084/actuator/health |
| **Subscription Service** | 9085 | Billing & subscriptions | http://localhost:9085/actuator/health |
| **Keycloak Sync Service** | 9086 | Keycloak synchronization | http://localhost:9086/actuator/health |
| **Registry Service** | 9087 | Role management | http://localhost:9087/actuator/health |

### Frontend Portals

| Portal | Port | Description | Purpose |
|--------|------|-------------|---------|
| **KYC-Pro Portal** | 4200 | Landing page and authentication | Entry point for all users |
| **Hub Portal** | 4201 | Platform admin interface | Platform-wide administration |
| **Console Portal** | 4202 | Tenant admin interface | Organization management |
| **Workspace Portal** | 4203 | User workspace interface | Task management and KYC workflows |

**📖 [Detailed Frontend Documentation](./documentation/frontend/)**

### Infrastructure Services

| Service | Port | Description | Health Check |
|---------|------|-------------|--------------|
| **PostgreSQL** | 5432 | Primary database | `psql -h localhost -p 5432 -U saas_user -d ekyc_platform` |
| **Keycloak** | 8080 | Identity and Access Management | http://localhost:8080 |

## 🗄️ Database Schema

### Database: `ekyc_platform`
- **Username:** `saas_user`
- **Password:** `saas_password`

### Schemas:
- `auth` - Authentication and user data
- `core` - Core business data
- `billing` - Subscription and billing data
- `registry` - Role management data

**📖 [Detailed Database Documentation](./documentation/database/)**

## 🔐 Keycloak Configuration

### Realm: `ekyc`
- **Admin URL:** http://localhost:8080
- **Admin Username:** `admin`
- **Admin Password:** `admin123`

### Client Configuration:
- **Client ID:** `admin-cli`
- **Client Secret:** (configured during setup)

**📖 [Keycloak Configuration Documentation](./documentation/database/keycloak-configuration.md)**

## 📋 API Testing & Documentation

### Postman Collections
- **Kyc-Pro Backend API** - Complete API collection with all endpoints
- **Environment Files**:
  - `Kyc-Pro-Direct-Access` - Direct service access for development
  - `Kyc-Pro-Gateway-Access` - Gateway-based access for production testing

### API Documentation
- **Service Endpoints** - Detailed endpoint documentation
- **API Documentation Summary** - Quick reference guide
- **Health Check Commands** - Service monitoring utilities

## 🚀 Service Details

### Backend Services

#### **Eureka Server (8761)**
- Service discovery and registration
- Central registry for all microservices
- Dashboard: http://localhost:8761
- **📖 [Detailed Documentation](./documentation/backend/eureka-server.md)**

#### **API Gateway (9080)**
- Central routing and load balancing
- Route configuration for all services
- Health check: http://localhost:9080/actuator/health
- **📖 [Detailed Documentation](./documentation/backend/api-gateway.md)**

#### **Auth Service (9081)**
- User authentication and authorization
- JWT token management
- Password encoding and validation
- Endpoints: `/api/auth/**`
- **📖 [Detailed Documentation](./documentation/backend/auth-service.md)**

#### **Tenant Service (9083)**
- Multi-tenant management
- Tenant creation, updates, deletion
- Tenant-specific configurations
- Endpoints: `/api/tenants/**`
- **📖 [Detailed Documentation](./documentation/backend/tenant-service.md)**

#### **User Service (9082)**
- User management within tenants
- User CRUD operations
- Role assignment
- Endpoints: `/api/users/**`
- **📖 [Detailed Documentation](./documentation/backend/user-service.md)**

#### **Module Service (9084)**
- Business module management
- Module configuration and settings
- Module-specific features
- Endpoints: `/api/modules/**`
- **📖 [Detailed Documentation](./documentation/backend/module-service.md)**

#### **Subscription Service (9085)**
- Billing and subscription management
- Payment processing
- Subscription lifecycle
- Endpoints: `/api/subscriptions/**`
- **📖 [Detailed Documentation](./documentation/backend/subscription-service.md)**

#### **Keycloak Sync Service (9087)**
- Synchronization with Keycloak
- User and role sync
- Audit logging
- Endpoints: `/api/keycloak-sync/**`
- **📖 [Detailed Documentation](./documentation/backend/keycloak-sync-service.md)**

#### **Registry Service (9086)**
- Role management and lifecycle
- Role validation and business rules
- Integration with Keycloak Sync
- Endpoints: `/api/registry/**`
- **📖 [Detailed Documentation](./documentation/backend/registry-service.md)**

### Frontend Portals

#### **KYC-Pro Portal (4200)**
- Landing page and authentication
- User registration and login
- Role-based routing
- Entry point for all users

#### **Hub Portal (4201)**
- Platform administration
- Tenant oversight
- Platform-wide analytics
- System management

#### **Console Portal (4202)**
- Tenant administration
- Organization management
- User management within tenant
- Subscription management

#### **Workspace Portal (4203)**
- User workspace interface
- Task management
- KYC workflow interface
- Collaboration tools

## 🔄 Service Communication

### API Gateway Routes:
```
/api/auth/** → Auth Service (9081)
/api/tenants/** → Tenant Service (9082)
/api/users/** → User Service (9083)
/api/modules/** → Module Service (9084)
/api/subscriptions/** → Subscription Service (9085)
/api/keycloak-sync/** → Keycloak Sync Service (9086)
/api/registry/** → Registry Service (9087)
```

### Service Dependencies:
```
API Gateway → Eureka Server
All Services → Eureka Server
Registry Service → Keycloak Sync Service → Keycloak
All Services → PostgreSQL Database
```

## 🛠️ Technology Stack

### Backend:
- **Java 21** with Spring Boot 3.4.0
- **Spring Cloud** 2024.0.2
- **PostgreSQL** 15
- **Keycloak** 23.0
- **Maven** for dependency management

### Frontend:
- **Angular** (multiple versions)
- **TypeScript**
- **Tailwind CSS**
- **Node.js** and npm

### Infrastructure:
- **Docker** for containerization
- **Docker Compose** for orchestration
- **Eureka** for service discovery

## 📊 Monitoring & Health

### Health Check Endpoints:
- All services: `/actuator/health`
- Eureka Dashboard: http://localhost:8761
- Keycloak Admin: http://localhost:8080

### Logging:
- All services configured with SLF4J
- Debug level enabled for development
- Structured logging for production

## 🔧 Environment Variables

### Database:
```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/ekyc_platform
DATABASE_USERNAME=saas_user
DATABASE_PASSWORD=saas_password
```

### Keycloak:
```bash
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=ekyc
KEYCLOAK_CLIENT_ID=admin-cli
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=admin123
```

### Eureka:
```bash
EUREKA_SERVER_URL=http://localhost:8761/eureka/
```

## 🚀 Quick Start

1. **Start Infrastructure:**
   ```bash
   cd backend
   docker-compose up -d
   ```

2. **Build Backend Services:**
   ```bash
   cd backend
   ./build_all.sh
   ```

3. **Start Frontend Portals:**
   ```bash
   # KYC-Pro Portal
   cd frontend/kyc-pro && npm start
   
   # Hub Portal
   cd frontend/hub && npm start
   
   # Console Portal
   cd frontend/console && npm start
   
   # Workspace Portal
   cd frontend/workspace && npm start
   ```

4. **Verify Services:**
   - Eureka: http://localhost:8761
   - API Gateway: http://localhost:9080
   - Keycloak: http://localhost:8080
   - Database: `psql -h localhost -p 5432 -U saas_user -d ekyc_platform` 