# KYC-Pro Platform Documentation

Welcome to the comprehensive documentation for the KYC-Pro platform. This directory contains detailed documentation for all aspects of the platform, from backend services to frontend applications.

## 📚 Documentation Structure

### 🏗️ Architecture & Design
- [Platform Architecture](./architecture/platform-architecture.md) - Complete system architecture overview
- [Microservices Design](./architecture/microservices-design.md) - Backend service architecture and communication
- [Database Design](./architecture/database-design.md) - Database schema and relationships
- [API Design](./architecture/api-design.md) - REST API design patterns and conventions

### 🔧 Backend Services
- [Eureka Server](./backend/eureka-server.md) - Service discovery and registration
- [API Gateway](./backend/api-gateway.md) - Central routing and load balancing
- [Auth Service](./backend/auth-service.md) - Authentication and authorization
- [Tenant Service](./backend/tenant-service.md) - Multi-tenant management
- [User Service](./backend/user-service.md) - User management
- [Module Service](./backend/module-service.md) - Business module management
- [Subscription Service](./backend/subscription-service.md) - Billing and subscriptions
- [Keycloak Sync Service](./backend/keycloak-sync-service.md) - Keycloak synchronization
- [Registry Service](./backend/registry-service.md) - Role management
- [Common Library](./backend/common-library.md) - Shared DTOs, constants, and utilities

### 🎨 Frontend Applications
- [KYC-Pro Portal](./frontend/kyc-pro-portal.md) - Landing page and authentication portal
- [Hub Portal](./frontend/hub-portal.md) - Platform admin interface
- [Console Portal](./frontend/console-portal.md) - Tenant admin interface
- [Workspace Portal](./frontend/workspace-portal.md) - User workspace interface
- [Design System](./frontend/design-system.md) - UI/UX design guidelines and components

### 🗄️ Database & Infrastructure
- [Database Schema](./database/database-schema.md) - Complete database design
- [Database Migrations](./database/database-migrations.md) - Schema evolution and migrations
- [Keycloak Configuration](./infrastructure/keycloak-configuration.md) - Identity management setup
- [Docker Configuration](./infrastructure/docker-configuration.md) - Containerization setup
- [Environment Configuration](./infrastructure/environment-configuration.md) - Environment variables and setup

### 🧪 Testing & API Documentation
- [API Testing Guide](./testing/api-testing-guide.md) - How to test all services
- [Postman Collections](./testing/postman-collections.md) - API testing collections
- [Health Check Commands](./testing/health-check-commands.md) - Service monitoring
- [Integration Testing](./testing/integration-testing.md) - End-to-end testing

### 🚀 Deployment & Operations
- [Local Development Setup](./deployment/local-development.md) - Setting up development environment
- [Production Deployment](./deployment/production-deployment.md) - Production deployment guide
- [Service Monitoring](./deployment/service-monitoring.md) - Health monitoring and logging
- [Troubleshooting Guide](./deployment/troubleshooting.md) - Common issues and solutions

### 📋 Business Logic
- [Multi-Tenancy](./business/multi-tenancy.md) - Tenant isolation and management
- [Role-Based Access Control](./business/role-based-access.md) - User roles and permissions
- [KYC Workflows](./business/kyc-workflows.md) - KYC process flows
- [Subscription Management](./business/subscription-management.md) - Billing and subscription logic

## 🔍 Quick Navigation

### By Role
- **Platform Admin**: [Hub Portal](./frontend/hub-portal.md) | [Platform Architecture](./architecture/platform-architecture.md)
- **Tenant Admin**: [Console Portal](./frontend/console-portal.md) | [Multi-Tenancy](./business/multi-tenancy.md)
- **Developer**: [Local Development](./deployment/local-development.md) | [API Testing](./testing/api-testing-guide.md)
- **DevOps**: [Production Deployment](./deployment/production-deployment.md) | [Docker Configuration](./infrastructure/docker-configuration.md)

### By Technology
- **Backend**: [Microservices Design](./architecture/microservices-design.md) | [API Design](./architecture/api-design.md)
- **Frontend**: [Design System](./frontend/design-system.md) | [Angular Applications](./frontend/)
- **Database**: [Database Schema](./database/database-schema.md) | [Database Migrations](./database/database-migrations.md)
- **Infrastructure**: [Docker Configuration](./infrastructure/docker-configuration.md) | [Keycloak Setup](./infrastructure/keycloak-configuration.md)

## 📖 How to Use This Documentation

1. **Start Here**: If you're new to the platform, begin with [Platform Architecture](./architecture/platform-architecture.md)
2. **Development Setup**: Follow [Local Development Setup](./deployment/local-development.md)
3. **API Testing**: Use [API Testing Guide](./testing/api-testing-guide.md) with Postman collections
4. **Service Details**: Navigate to specific service documentation in the backend section
5. **Frontend Development**: Check the frontend section for component architecture

## 🔄 Documentation Updates

This documentation is maintained alongside the codebase. When making changes to:
- **Backend Services**: Update corresponding service documentation
- **Frontend Applications**: Update portal-specific documentation
- **Database Schema**: Update database documentation
- **API Changes**: Update API documentation and Postman collections

## 📞 Support

For questions about this documentation or the KYC-Pro platform:
- Check the [Troubleshooting Guide](./deployment/troubleshooting.md) for common issues
- Review [Service Monitoring](./deployment/service-monitoring.md) for health checks
- Consult [API Testing Guide](./testing/api-testing-guide.md) for testing procedures

---

*Last Updated: [Current Date]*
*Platform Version: 1.0.0* 