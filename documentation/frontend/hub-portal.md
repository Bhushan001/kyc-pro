# Hub Portal

## 📋 Application Overview

**Application Name**: Hub Portal  
**Port**: 4201  
**Framework**: Angular 17.3.0  
**Build Tool**: Angular CLI  
**Styling**: Tailwind CSS  
**Package Manager**: npm

## 🎯 Purpose & Functionality

The Hub Portal is the **platform administration interface** for the KYC-Pro platform. It provides platform-wide management capabilities for platform administrators to oversee all tenants, users, modules, and system analytics.

### Key Responsibilities:
- **Platform Dashboard**: Overview of platform-wide metrics and status
- **Tenant Management**: Create, view, and manage all tenant organizations
- **Module Management**: Configure and manage business modules
- **Analytics**: Platform-wide analytics and reporting
- **System Administration**: Platform configuration and settings
- **User Oversight**: Monitor and manage platform users
- **Revenue Tracking**: Track subscription revenue and billing

## ⚙️ Configuration Details

### Package Configuration
```json
{
  "name": "hub",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve --port 4201",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  }
}
```

### Angular Configuration
```json
{
  "projectType": "application",
  "root": "",
  "sourceRoot": "src",
  "prefix": "app",
  "architect": {
    "build": {
      "builder": "@angular-devkit/build-angular:application",
      "options": {
        "outputPath": "dist/hub",
        "index": "src/index.html",
        "browser": "src/main.ts",
        "polyfills": ["zone.js"],
        "tsConfig": "tsconfig.app.json",
        "assets": ["src/favicon.ico", "src/assets"],
        "styles": ["src/styles.css", "src/styles/globals.css"]
      }
    }
  }
}
```

### Dependencies
```json
{
  "dependencies": {
    "@angular/animations": "^17.3.0",
    "@angular/common": "^17.3.0",
    "@angular/compiler": "^17.3.0",
    "@angular/core": "^17.3.0",
    "@angular/forms": "^17.3.0",
    "@angular/platform-browser": "^17.3.0",
    "@angular/platform-browser-dynamic": "^17.3.0",
    "@angular/router": "^17.3.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.3"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.17",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6"
  }
}
```

## 🏗️ Application Architecture

### Component Structure
```
src/app/
├── components/
│   ├── dashboard.component.ts      # Main dashboard
│   ├── tenants.component.ts        # Tenant management
│   ├── modules.component.ts        # Module management
│   └── analytics.component.ts      # Analytics and reporting
├── services/
│   └── api.service.ts              # API service
├── app.component.ts                # Main app component
├── app.routes.ts                   # Application routing
└── app.config.ts                   # Application configuration
```

### Routing Configuration
```typescript
export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tenants', component: TenantsComponent },
  { path: 'modules', component: ModulesComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: '**', redirectTo: '' }
];
```

## 🔌 Features & Components

### Dashboard (`DashboardComponent`)
- **Platform Overview**: Key metrics and system status
- **Quick Actions**: Common administrative tasks
- **Recent Activity**: Latest platform activities
- **System Health**: Service status and monitoring
- **Revenue Summary**: Subscription revenue overview

### Tenant Management (`TenantsComponent`)
- **Tenant List**: View all tenant organizations
- **Tenant Creation**: Create new tenant organizations
- **Tenant Details**: View and edit tenant information
- **Tenant Status**: Monitor tenant health and usage
- **Billing Overview**: Tenant subscription and billing

### Module Management (`ModulesComponent`)
- **Module Configuration**: Configure business modules
- **Feature Management**: Manage module features
- **Pricing Management**: Set module pricing
- **Module Analytics**: Track module usage
- **Deployment Management**: Module deployment status

### Analytics (`AnalyticsComponent`)
- **Platform Analytics**: Platform-wide metrics
- **User Analytics**: User behavior and patterns
- **Revenue Analytics**: Subscription and revenue trends
- **Performance Analytics**: System performance metrics
- **Custom Reports**: Generate custom reports

## 🎨 Design System

### Styling Framework
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Admin Theme**: Professional admin interface design
- **Data Visualization**: Charts and analytics components

### Design Principles
- **Professional Interface**: Clean, professional admin design
- **Data Density**: Efficient use of screen space
- **Quick Actions**: Easy access to common tasks
- **Real-time Updates**: Live data and status updates

## 🔧 Environment Configuration

### Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Environment Variables
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `API_BASE_URL` | http://localhost:9080 | Backend API base URL |
| `HUB_PORT` | 4201 | Application port |
| `ENVIRONMENT` | development | Application environment |

## 🚀 Deployment

### Docker Configuration
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist/hub /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### Docker Compose
```yaml
hub-portal:
  build: ./frontend/hub
  ports:
    - "4201:80"
  environment:
    - API_BASE_URL=http://api-gateway:9080
  depends_on:
    - api-gateway
```

## 🔍 Development Workflow

### Local Development
```bash
# Clone repository
git clone <repository-url>
cd frontend/hub

# Install dependencies
npm install

# Start development server
npm start

# Access application
open http://localhost:4201
```

### Build Process
```bash
# Development build
npm run build

# Production build
npm run build --configuration production

# Watch mode
npm run watch
```

## 🧪 Testing

### Unit Testing
```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --code-coverage

# Run specific test file
npm test -- --include="**/dashboard.component.spec.ts"
```

### E2E Testing
```bash
# Run E2E tests
ng e2e

# Run E2E tests in headless mode
ng e2e --headless
```

## 🔐 Security Features

### Authentication & Authorization
- **Platform Admin Access**: Restricted to platform administrators
- **Role-based Access**: Different access levels for admin functions
- **Session Management**: Secure session handling
- **Audit Logging**: Track all administrative actions

### Security Measures
- **Input Validation**: Validate all admin inputs
- **CSRF Protection**: Cross-site request forgery prevention
- **XSS Prevention**: Input sanitization
- **Secure Communication**: HTTPS for all communications

## 📊 Analytics & Monitoring

### Platform Metrics
- **User Growth**: Track user registration and growth
- **Tenant Metrics**: Monitor tenant creation and activity
- **Revenue Analytics**: Track subscription revenue
- **System Performance**: Monitor service health and performance

### Reporting Features
- **Real-time Dashboards**: Live platform metrics
- **Custom Reports**: Generate custom analytics reports
- **Export Capabilities**: Export data in various formats
- **Scheduled Reports**: Automated report generation

## 🔄 Integration

### Backend Services
- **API Gateway**: Central API routing
- **Tenant Service**: Tenant management operations
- **User Service**: User management and oversight
- **Module Service**: Module configuration and management
- **Subscription Service**: Revenue and billing data
- **Analytics Service**: Platform analytics and reporting

### External Services
- **Monitoring Tools**: System monitoring and alerting
- **Analytics Platforms**: Advanced analytics integration
- **Notification Services**: Admin notifications and alerts

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 1024px (Primary interface)
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px (Limited functionality)

### Admin Interface Features
- **Data Tables**: Sortable and filterable data tables
- **Charts & Graphs**: Interactive data visualization
- **Quick Actions**: Efficient administrative workflows
- **Bulk Operations**: Mass operations for efficiency

## 📚 Related Documentation

- [KYC-Pro Portal](./kyc-pro-portal.md) - Main landing portal
- [Console Portal](./console-portal.md) - Tenant admin interface
- [Workspace Portal](./workspace-portal.md) - User workspace interface
- [Design System](./design-system.md) - UI/UX guidelines
- [Tenant Service](../backend/tenant-service.md) - Tenant management backend
- [User Service](../backend/user-service.md) - User management backend

---

*Last Updated: [Current Date]*  
*Application Version: 1.0.0* 