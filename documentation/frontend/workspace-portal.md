# Workspace Portal

## 📋 Application Overview

**Application Name**: Workspace Portal  
**Port**: 4203  
**Framework**: Angular 17.3.0  
**Build Tool**: Angular CLI  
**Styling**: Tailwind CSS  
**Package Manager**: npm

## 🎯 Purpose & Functionality

The Workspace Portal is the **user workspace interface** for the KYC-Pro platform. It provides end-users with tools for task management, KYC workflows, collaboration, and productivity features within their assigned modules and tenant context.

### Key Responsibilities:
- **Task Management**: Create, track, and manage KYC tasks
- **KYC Workflows**: Execute KYC verification processes
- **Kanban Boards**: Visual task management and workflow tracking
- **Module Access**: Access to assigned business modules
- **Collaboration Tools**: Team communication and file sharing
- **Reports & Analytics**: Generate and view reports
- **Document Management**: Handle KYC documents and files

## ⚙️ Configuration Details

### Package Configuration
```json
{
  "name": "workspace",
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
        "outputPath": "dist/workspace",
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
│   ├── dashboard.component.ts      # Workspace dashboard
│   ├── tasks.component.ts          # Task management
│   ├── kanban.component.ts         # Kanban board
│   ├── modules.component.ts        # Module access
│   └── reports.component.ts        # Reports and analytics
├── services/
│   └── api.service.ts              # API service
├── app.component.ts                # Main app component
├── app.routes.ts                   # Application routing
└── app.config.ts                   # Application configuration
```

### Routing Configuration
```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/workspace/dashboard', pathMatch: 'full' },
  { path: 'workspace/dashboard', component: DashboardComponent },
  { path: 'workspace/tasks', component: TasksComponent },
  { path: 'workspace/kanban', component: KanbanComponent },
  { path: 'workspace/modules', component: ModulesComponent },
  { path: 'workspace/reports', component: ReportsComponent },
  { path: '**', redirectTo: '/workspace/dashboard' }
];
```

## 🔌 Features & Components

### Dashboard (`DashboardComponent`)
- **Workspace Overview**: Personal workspace metrics and status
- **Recent Tasks**: Latest assigned and completed tasks
- **Quick Actions**: Common workspace actions
- **Module Status**: Active modules and recent activity
- **Team Activity**: Recent team activities and updates

### Task Management (`TasksComponent`)
- **Task List**: View all assigned and created tasks
- **Task Creation**: Create new KYC tasks
- **Task Details**: View and edit task information
- **Task Status**: Track task progress and status
- **Task Assignment**: Assign tasks to team members
- **Task Comments**: Collaborate on tasks

### Kanban Board (`KanbanComponent`)
- **Visual Workflow**: Drag-and-drop task management
- **Board Views**: Different workflow stages
- **Task Cards**: Detailed task information
- **Progress Tracking**: Visual progress indicators
- **Team Collaboration**: Real-time collaboration features

### Module Access (`ModulesComponent`)
- **Module List**: Access to assigned business modules
- **Module Features**: Use module-specific features
- **Module Status**: Track module usage and performance
- **Customization**: Personal module preferences
- **Integration**: Connect with external tools

### Reports (`ReportsComponent`)
- **Personal Reports**: Individual performance reports
- **Team Reports**: Team activity and performance
- **KYC Reports**: KYC process and compliance reports
- **Analytics**: Data visualization and insights
- **Export Features**: Export reports in various formats

## 🎨 Design System

### Styling Framework
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Workspace Theme**: Productivity-focused interface
- **Interactive Elements**: Drag-and-drop and real-time features

### Design Principles
- **Productivity-focused**: Interface designed for efficient work
- **Collaborative**: Features for team collaboration
- **Intuitive Navigation**: Easy access to common tasks
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
| `WORKSPACE_PORT` | 4203 | Application port |
| `USER_ID` | | Current user ID |
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
COPY --from=builder /app/dist/workspace /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### Docker Compose
```yaml
workspace-portal:
  build: ./frontend/workspace
  ports:
    - "4203:80"
  environment:
    - API_BASE_URL=http://api-gateway:9080
    - USER_ID=${USER_ID}
    - TENANT_ID=${TENANT_ID}
  depends_on:
    - api-gateway
```

## 🔍 Development Workflow

### Local Development
```bash
# Clone repository
git clone <repository-url>
cd frontend/workspace

# Install dependencies
npm install

# Start development server
npm start

# Access application
open http://localhost:4203
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
- **User Access**: Restricted to authenticated users
- **Module Access**: Access only to assigned modules
- **Tenant Isolation**: Data isolation within tenant context
- **Role-based Permissions**: Different access levels for features

### Security Measures
- **User Context**: All operations within user context
- **Input Validation**: Validate all user inputs
- **File Security**: Secure file upload and storage
- **Session Management**: Secure session handling

## 📊 Analytics & Monitoring

### User Metrics
- **Task Analytics**: Track task completion and performance
- **Module Usage**: Monitor module usage and efficiency
- **Collaboration Metrics**: Team collaboration patterns
- **Productivity Analytics**: User productivity insights

### Reporting Features
- **Personal Reports**: Individual performance reports
- **Team Reports**: Team activity and collaboration reports
- **KYC Reports**: KYC process and compliance reports
- **Custom Reports**: Generate custom workspace reports

## 🔄 Integration

### Backend Services
- **API Gateway**: Central API routing
- **User Service**: User profile and preferences
- **Module Service**: Module access and features
- **Task Service**: Task management and workflow
- **File Service**: Document and file management

### External Services
- **File Storage**: Document storage and management
- **Email Services**: Task notifications and updates
- **Collaboration Tools**: Team communication integration
- **Analytics Platforms**: Productivity analytics integration

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 1024px (Primary interface)
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px (Limited functionality)

### Workspace Interface Features
- **Drag-and-Drop**: Interactive task management
- **Real-time Updates**: Live collaboration features
- **Responsive Tables**: Mobile-friendly data tables
- **Touch-friendly**: Optimized for touch interactions

## 📚 Related Documentation

- [KYC-Pro Portal](./kyc-pro-portal.md) - Main landing portal
- [Hub Portal](./hub-portal.md) - Platform admin interface
- [Console Portal](./console-portal.md) - Tenant admin interface
- [Design System](./design-system.md) - UI/UX guidelines
- [User Service](../backend/user-service.md) - User management backend
- [Module Service](../backend/module-service.md) - Module management backend

---

*Last Updated: [Current Date]*  
*Application Version: 1.0.0* 