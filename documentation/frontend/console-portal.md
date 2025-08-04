# Console Portal

## 📋 Application Overview

**Application Name**: Console Portal  
**Port**: 4202  
**Framework**: Angular 17.3.0  
**Build Tool**: Angular CLI  
**Styling**: Tailwind CSS  
**Package Manager**: npm

## 🎯 Purpose & Functionality

The Console Portal is the **tenant administration interface** for the KYC-Pro platform. It provides tenant-specific management capabilities for tenant administrators to manage their organization's users, modules, and operations within their tenant context.

### Key Responsibilities:
- **Tenant Dashboard**: Overview of tenant-specific metrics and status
- **User Management**: Create, view, and manage tenant users
- **Module Management**: Configure and manage tenant-specific modules
- **Subscription Management**: Manage tenant subscriptions and billing
- **Organization Settings**: Configure tenant-specific settings
- **User Analytics**: Monitor user activity within tenant
- **Compliance Management**: Handle tenant compliance requirements

## ⚙️ Configuration Details

### Package Configuration
```json
{
  "name": "console",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
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
        "outputPath": "dist/console",
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
│   ├── dashboard.component.ts      # Tenant dashboard
│   ├── users.component.ts          # User management
│   ├── modules.component.ts        # Module management
│   ├── billing.component.ts        # Subscription management
│   └── settings.component.ts       # Tenant settings
├── services/
│   └── api.service.ts              # API service
├── app.component.ts                # Main app component
├── app.routes.ts                   # Application routing
└── app.config.ts                   # Application configuration
```

### Routing Configuration
```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/' }
];
```

## 🔌 Features & Components

### Dashboard (`DashboardComponent`)
- **Tenant Overview**: Key metrics and tenant status
- **User Summary**: User count and activity
- **Module Status**: Active modules and usage
- **Billing Summary**: Subscription and billing overview
- **Recent Activity**: Latest tenant activities

### User Management (`UsersComponent`)
- **User List**: View all tenant users
- **User Creation**: Create new tenant users
- **User Details**: View and edit user information
- **Role Assignment**: Assign roles to users
- **User Analytics**: Track user activity and performance

### Module Management (`ModulesComponent`)
- **Module Configuration**: Configure tenant-specific modules
- **Feature Management**: Manage module features
- **Usage Analytics**: Track module usage within tenant
- **Module Deployment**: Deploy and manage modules
- **Customization**: Tenant-specific module customization

### Billing Management (`BillingComponent`)
- **Subscription Overview**: Current subscription details
- **Billing History**: Past billing records
- **Payment Management**: Handle payment methods
- **Usage Tracking**: Monitor usage and costs
- **Plan Management**: Upgrade or downgrade plans

### Settings (`SettingsComponent`)
- **Organization Settings**: Configure tenant organization
- **Security Settings**: Manage security configurations
- **Notification Settings**: Configure notifications
- **Integration Settings**: Manage external integrations
- **Compliance Settings**: Handle compliance requirements

## 🎨 Design System

### Styling Framework
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Tenant Theme**: Professional tenant admin interface
- **Data Visualization**: Charts and analytics components

### Design Principles
- **Tenant-focused**: Interface designed for tenant administrators
- **Efficient Workflows**: Streamlined administrative processes
- **Data Clarity**: Clear presentation of tenant data
- **User-friendly**: Intuitive navigation and interactions

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
| `CONSOLE_PORT` | 4202 | Application port |
| `TENANT_ID` | | Current tenant ID |
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
COPY --from=builder /app/dist/console /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### Docker Compose
```yaml
console-portal:
  build: ./frontend/console
  ports:
    - "4202:80"
  environment:
    - API_BASE_URL=http://api-gateway:9080
    - TENANT_ID=${TENANT_ID}
  depends_on:
    - api-gateway
```

## 🔍 Development Workflow

### Local Development
```bash
# Clone repository
git clone <repository-url>
cd frontend/console

# Install dependencies
npm install

# Start development server
npm start

# Access application
open http://localhost:4202
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
- **Tenant Admin Access**: Restricted to tenant administrators
- **Tenant Isolation**: Data isolation between tenants
- **Role-based Access**: Different access levels for tenant functions
- **Session Management**: Secure session handling

### Security Measures
- **Tenant Context**: All operations within tenant context
- **Input Validation**: Validate all tenant inputs
- **Data Encryption**: Encrypt sensitive tenant data
- **Audit Logging**: Track all tenant administrative actions

## 📊 Analytics & Monitoring

### Tenant Metrics
- **User Analytics**: Track user activity within tenant
- **Module Usage**: Monitor module usage and performance
- **Billing Analytics**: Track subscription and billing
- **Compliance Metrics**: Monitor compliance requirements

### Reporting Features
- **Tenant Reports**: Generate tenant-specific reports
- **User Reports**: User activity and performance reports
- **Billing Reports**: Subscription and billing reports
- **Compliance Reports**: Compliance and audit reports

## 🔄 Integration

### Backend Services
- **API Gateway**: Central API routing
- **User Service**: User management within tenant
- **Module Service**: Module configuration and management
- **Subscription Service**: Tenant billing and subscription
- **Tenant Service**: Tenant-specific operations

### External Services
- **Payment Gateways**: Payment processing integration
- **Email Services**: Tenant notification services
- **Analytics Platforms**: Tenant analytics integration
- **Compliance Tools**: Compliance monitoring and reporting

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 1024px (Primary interface)
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px (Limited functionality)

### Tenant Interface Features
- **Data Tables**: Sortable and filterable tenant data
- **Charts & Graphs**: Interactive tenant analytics
- **Quick Actions**: Efficient tenant workflows
- **Bulk Operations**: Mass operations for tenant management

## 📚 Related Documentation

- [KYC-Pro Portal](./kyc-pro-portal.md) - Main landing portal
- [Hub Portal](./hub-portal.md) - Platform admin interface
- [Workspace Portal](./workspace-portal.md) - User workspace interface
- [Design System](./design-system.md) - UI/UX guidelines
- [User Service](../backend/user-service.md) - User management backend
- [Tenant Service](../backend/tenant-service.md) - Tenant management backend

---

*Last Updated: [Current Date]*  
*Application Version: 1.0.0* 