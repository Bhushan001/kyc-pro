# KYC-Pro Portal

## 📋 Application Overview

**Application Name**: KYC-Pro Portal  
**Port**: 4200  
**Framework**: Angular 17.3.0  
**Build Tool**: Angular CLI  
**Styling**: Tailwind CSS  
**Package Manager**: npm

## 🎯 Purpose & Functionality

The KYC-Pro Portal is the **main landing page and authentication portal** for the KYC-Pro platform. It serves as the entry point for all users and provides authentication, registration, and role-based routing to other portals.

### Key Responsibilities:
- **Landing Page**: Platform introduction and feature showcase
- **User Authentication**: Login and logout functionality
- **User Registration**: Multi-role signup (Platform Admin, Tenant Admin, User)
- **Role-based Routing**: Route users to appropriate portals based on their role
- **Profile Management**: User profile viewing and editing
- **Error Handling**: Error pages and user feedback
- **Responsive Design**: Mobile-first responsive design

## ⚙️ Configuration Details

### Package Configuration
```json
{
  "name": "kyc-pro",
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
        "outputPath": "dist/kyc-pro",
        "index": "src/index.html",
        "browser": "src/main.ts",
        "polyfills": ["zone.js"],
        "tsConfig": "tsconfig.app.json",
        "assets": ["src/favicon.ico", "src/assets"],
        "styles": ["src/styles.css", "src/styles/globals.css"]
      }
    },
    "serve": {
      "builder": "@angular-devkit/build-angular:dev-server",
      "configurations": {
        "production": {
          "buildTarget": "kyc-pro:build:production"
        },
        "development": {
          "buildTarget": "kyc-pro:build:development"
        }
      },
      "defaultConfiguration": "development"
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
    "tailwindcss": "^3.4.17",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.3"
  }
}
```

## 🏗️ Application Architecture

### Component Structure
```
src/app/
├── components/
│   ├── landing/           # Landing page component
│   ├── login/            # Login component
│   ├── platform-admin-signup/  # Platform admin registration
│   ├── tenant-admin-signup/    # Tenant admin registration
│   ├── user-signup/      # User registration
│   ├── dashboard/        # Dashboard component
│   ├── profile/          # Profile management
│   ├── error/            # Error handling
│   └── loading/          # Loading states
├── services/
│   └── auth.service.ts   # Authentication service
├── app.component.ts      # Main app component
├── app.routes.ts         # Application routing
└── app.config.ts         # Application configuration
```

### Routing Configuration
```typescript
export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup/platform-admin', component: PlatformAdminSignupComponent },
  { path: 'signup/tenant-admin', component: TenantAdminSignupComponent },
  { path: 'signup/user', component: UserSignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: ErrorComponent }
];
```

## 🔌 Features & Components

### Landing Page (`LandingComponent`)
- **Platform Introduction**: Overview of KYC-Pro platform
- **Feature Showcase**: Highlight key features and benefits
- **Call-to-Action**: Registration and login buttons
- **Responsive Design**: Mobile-first design approach

### Authentication (`LoginComponent`)
- **User Login**: Email/password authentication
- **Form Validation**: Input validation and error handling
- **Remember Me**: Session management
- **Forgot Password**: Password recovery functionality

### Registration Components
#### Platform Admin Signup (`PlatformAdminSignupComponent`)
- **Admin Registration**: Platform administrator signup
- **Company Information**: Organization details
- **Contact Information**: Admin contact details
- **Terms & Conditions**: Legal agreement acceptance

#### Tenant Admin Signup (`TenantAdminSignupComponent`)
- **Tenant Registration**: Tenant organization signup
- **Tenant Information**: Organization details and industry
- **Admin Details**: Tenant administrator information
- **Subscription Selection**: Module and plan selection

#### User Signup (`UserSignupComponent`)
- **User Registration**: End-user signup
- **Personal Information**: User profile details
- **Tenant Association**: Link to existing tenant
- **Role Assignment**: User role selection

### Dashboard (`DashboardComponent`)
- **Role-based Dashboard**: Different views based on user role
- **Quick Actions**: Common user actions
- **Navigation**: Links to other portals
- **User Information**: Display user profile and status

### Profile Management (`ProfileComponent`)
- **Profile Viewing**: Display user profile information
- **Profile Editing**: Update user details
- **Password Change**: Secure password updates
- **Account Settings**: User preferences and settings

### Error Handling (`ErrorComponent`)
- **Error Display**: User-friendly error messages
- **Navigation**: Back to previous page or home
- **Support Contact**: Help and support information

## 🎨 Design System

### Styling Framework
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Custom Styles**: Global styles in `src/styles/globals.css`
- **Component Styles**: Scoped component styles

### Design Principles
- **Consistent Theming**: Unified color scheme and typography
- **Accessibility**: WCAG compliant design
- **User Experience**: Intuitive navigation and interactions
- **Performance**: Optimized loading and rendering

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
| `AUTH_SERVICE_URL` | http://localhost:9081 | Auth service URL |
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
COPY --from=builder /app/dist/kyc-pro /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### Docker Compose
```yaml
kyc-pro-portal:
  build: ./frontend/kyc-pro
  ports:
    - "4200:80"
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
cd frontend/kyc-pro

# Install dependencies
npm install

# Start development server
npm start

# Access application
open http://localhost:4200
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
npm test -- --include="**/login.component.spec.ts"
```

### E2E Testing
```bash
# Run E2E tests
ng e2e

# Run E2E tests in headless mode
ng e2e --headless
```

## 🔐 Security Features

### Authentication Flow
1. **User Input**: User enters credentials
2. **Form Validation**: Client-side validation
3. **API Call**: Send request to auth service
4. **Token Storage**: Store JWT token securely
5. **Route Guard**: Protect routes based on authentication
6. **Role-based Access**: Route to appropriate portal

### Security Measures
- **Input Validation**: Client-side and server-side validation
- **Token Management**: Secure JWT token handling
- **Route Protection**: Authentication guards
- **XSS Prevention**: Input sanitization
- **CSRF Protection**: Cross-site request forgery prevention

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- **Touch-friendly**: Optimized for touch interactions
- **Responsive Navigation**: Collapsible navigation menu
- **Optimized Forms**: Mobile-friendly form inputs
- **Performance**: Optimized for mobile networks

## 🔄 Integration

### Backend Services
- **Auth Service**: Authentication and user management
- **User Service**: User profile and data management
- **Tenant Service**: Tenant information and management
- **API Gateway**: Central API routing

### External Services
- **Email Service**: Registration confirmations
- **Analytics**: User behavior tracking
- **Monitoring**: Application performance monitoring

## 📚 Related Documentation

- [Hub Portal](./hub-portal.md) - Platform admin interface
- [Console Portal](./console-portal.md) - Tenant admin interface
- [Workspace Portal](./workspace-portal.md) - User workspace interface
- [Design System](./design-system.md) - UI/UX guidelines
- [Auth Service](../backend/auth-service.md) - Authentication backend

---

*Last Updated: [Current Date]*  
*Application Version: 1.0.0* 