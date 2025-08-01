#!/bin/bash
set -euo pipefail

PORTAL_NAME="workspace-portal"
PORTAL_PATH="frontend/${PORTAL_NAME}"
NG_VERSION="17"

echo "Generating Angular ${PORTAL_NAME} using Angular CLI..."

# Generate Angular app scaffold with routing and CSS
npx --yes @angular/cli@"${NG_VERSION}" new "${PORTAL_NAME}" \
  --directory "${PORTAL_PATH}" \
  --routing=true --style=css --skip-tests --skip-git --skip-install > /dev/null 2>&1

echo "Replacing default files with custom scaffold..."

# Overwrite main.ts to bootstrap standalone root app component
cat > "${PORTAL_PATH}/src/main.ts" <<'TS'
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
  ]
});
TS

# Remove default src/app content and recreate structure
rm -rf "${PORTAL_PATH}/src/app"
mkdir -p "${PORTAL_PATH}/src/app/components"
mkdir -p "${PORTAL_PATH}/src/app/services"

# Root AppComponent with sidebar navigation for end users
cat > "${PORTAL_PATH}/src/app/app.component.ts" <<'TS'
import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col">
      <nav class="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div class="text-xl font-bold text-teal-700">Workspace Portal</div>
        <button class="text-sm text-teal-600 hover:text-teal-900" (click)="logout()">Logout</button>
      </nav>
      <div class="flex flex-1">
        <aside class="w-64 bg-gray-100 p-4 space-y-4">
          <a routerLink="/workspace/dashboard" routerLinkActive="font-bold text-teal-700" class="block py-2 hover:text-teal-700">Dashboard</a>
          <a routerLink="/workspace/tasks" routerLinkActive="font-bold text-teal-700" class="block py-2 hover:text-teal-700">Tasks</a>
          <a routerLink="/workspace/kanban" routerLinkActive="font-bold text-teal-700" class="block py-2 hover:text-teal-700">Kanban</a>
          <a routerLink="/workspace/modules" routerLinkActive="font-bold text-teal-700" class="block py-2 hover:text-teal-700">Modules</a>
          <a routerLink="/workspace/reports" routerLinkActive="font-bold text-teal-700" class="block py-2 hover:text-teal-700">Reports</a>
        </aside>
        <main class="flex-1 p-6 overflow-auto bg-white">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AppComponent {
  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
TS

# Routing configuration with placeholder routes
cat > "${PORTAL_PATH}/src/app/app.routes.ts" <<'TS'
import { Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard.component';
import { TasksComponent } from './components/tasks.component';
import { KanbanComponent } from './components/kanban.component';
import { ModulesComponent } from './components/modules.component';
import { ReportsComponent } from './components/reports.component';

export const routes: Routes = [
  { path: '', redirectTo: '/workspace/dashboard', pathMatch: 'full' },
  { path: 'workspace/dashboard', component: DashboardComponent },
  { path: 'workspace/tasks', component: TasksComponent },
  { path: 'workspace/kanban', component: KanbanComponent },
  { path: 'workspace/modules', component: ModulesComponent },
  { path: 'workspace/reports', component: ReportsComponent },
  { path: '**', redirectTo: '/workspace/dashboard' }
];
TS

# Dashboard component
cat > "${PORTAL_PATH}/src/app/components/dashboard.component.ts" <<'TS'
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Dashboard</h2>
    <p>Welcome to your workspace dashboard.</p>
  `
})
export class DashboardComponent {}
TS

# Tasks component
cat > "${PORTAL_PATH}/src/app/components/tasks.component.ts" <<'TS'
import { Component } from '@angular/core';

@Component({
  selector: 'app-tasks',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Tasks</h2>
    <p>Manage your tasks here.</p>
  `
})
export class TasksComponent {}
TS

# Kanban component
cat > "${PORTAL_PATH}/src/app/components/kanban.component.ts" <<'TS'
import { Component } from '@angular/core';

@Component({
  selector: 'app-kanban',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Kanban Board</h2>
    <p>Drag and drop your tasks to track progress.</p>
  `
})
export class KanbanComponent {}
TS

# Modules component
cat > "${PORTAL_PATH}/src/app/components/modules.component.ts" <<'TS'
import { Component } from '@angular/core';

@Component({
  selector: 'app-modules',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Modules</h2>
    <p>Explore your subscribed modules here.</p>
  `
})
export class ModulesComponent {}
TS

# Reports component
cat > "${PORTAL_PATH}/src/app/components/reports.component.ts" <<'TS'
import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Reports</h2>
    <p>View performance and analytics reports.</p>
  `
})
export class ReportsComponent {}
TS

# API service stub
cat > "${PORTAL_PATH}/src/app/services/api.service.ts" <<'TS'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tasks`);
  }

  getModules(): Observable<any> {
    return this.http.get(`${this.baseUrl}/modules`);
  }

  // Add more API calls as needed
}
TS

# Tailwind CSS config file
cat > "${PORTAL_PATH}/tailwind.config.js" <<'JS'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
JS

# styles.css with Tailwind directives
cat > "${PORTAL_PATH}/src/styles.css" <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
CSS

# Dockerfile for production build and nginx serve
cat > "${PORTAL_PATH}/Dockerfile" <<'DOCKER'
# Stage 1: build Angular app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build -- --configuration production

# Stage 2: serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist/workspace-portal /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
DOCKER

echo "✅ ${PORTAL_NAME} portal scaffold complete at ${PORTAL_PATH}."
echo "Next steps:"
echo "  cd ${PORTAL_PATH}"
echo "  npm install"
echo "  ng serve --open"
echo ""
echo "Or build and run Docker image:"
echo "  docker build -t ${PORTAL_NAME}:latest ."
echo "  docker run -p 4203:80 ${PORTAL_NAME}:latest"
