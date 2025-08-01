#!/bin/bash
set -euo pipefail

PORTAL_NAME="hub-portal"
PORTAL_PATH="frontend/${PORTAL_NAME}"
NG_VERSION="17"

echo "Generating Angular ${PORTAL_NAME} using Angular CLI..."

# Generate Angular app via Angular CLI
npx --yes @angular/cli@"$NG_VERSION" new "$PORTAL_NAME" \
  --directory "$PORTAL_PATH" \
  --routing=true --style=css --skip-tests --skip-git --skip-install > /dev/null

echo "Replacing default files with custom scaffold..."

# Overwrite main.ts to bootstrap standalone root AppComponent
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

# Remove generated app folder and create all from scratch for standalone components approach
rm -rf "${PORTAL_PATH}/src/app"
mkdir -p "${PORTAL_PATH}/src/app/components"
mkdir -p "${PORTAL_PATH}/src/app/services"

# AppComponent - layout with sidebar and router-outlet
cat > "${PORTAL_PATH}/src/app/app.component.ts" <<'TS'
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen flex flex-col">
      <nav class="bg-white shadow py-4 px-6 flex justify-between items-center">
        <div class="text-xl font-bold text-indigo-700">Platform HUB</div>
        <button class="text-sm text-indigo-600 hover:text-indigo-900" (click)="logout()">Logout</button>
      </nav>
      <div class="flex flex-1">
        <aside class="w-64 bg-gray-100 p-4 space-y-4">
          <a routerLink="/hub/dashboard" routerLinkActive="font-bold text-indigo-700" class="block py-2 hover:text-indigo-700">Dashboard</a>
          <a routerLink="/hub/tenants" routerLinkActive="font-bold text-indigo-700" class="block py-2 hover:text-indigo-700">Tenants</a>
          <a routerLink="/hub/modules" routerLinkActive="font-bold text-indigo-700" class="block py-2 hover:text-indigo-700">Modules</a>
          <a routerLink="/hub/analytics" routerLinkActive="font-bold text-indigo-700" class="block py-2 hover:text-indigo-700">Analytics</a>
        </aside>
        <main class="flex-1 p-6 bg-white overflow-auto">
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

# Routing configuration with stub routes
cat > "${PORTAL_PATH}/src/app/app.routes.ts" <<'TS'
import { Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard.component';
import { TenantsComponent } from './components/tenants.component';
import { ModulesComponent } from './components/modules.component';
import { AnalyticsComponent } from './components/analytics.component';

export const routes: Routes = [
  { path: '', redirectTo: '/hub/dashboard', pathMatch: 'full' },
  { path: 'hub/dashboard', component: DashboardComponent },
  { path: 'hub/tenants', component: TenantsComponent },
  { path: 'hub/modules', component: ModulesComponent },
  { path: 'hub/analytics', component: AnalyticsComponent },
  { path: '**', redirectTo: '/hub/dashboard' }
];
TS

# Dashboard component (simple)
cat > "${PORTAL_PATH}/src/app/components/dashboard.component.ts" <<'TS'
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Dashboard</h2>
    <p>Welcome to the platform administration dashboard.</p>
  `
})
export class DashboardComponent {}
TS

# Tenants component (placeholder)
cat > "${PORTAL_PATH}/src/app/components/tenants.component.ts" <<'TS'
import { Component } from '@angular/core';

@Component({
  selector: 'app-tenants',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Tenants</h2>
    <p>Tenant management will be implemented here.</p>
  `
})
export class TenantsComponent {}
TS

# Modules component (placeholder)
cat > "${PORTAL_PATH}/src/app/components/modules.component.ts" <<'TS'
import { Component } from '@angular/core';

@Component({
  selector: 'app-modules',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Modules</h2>
    <p>Module marketplace management goes here.</p>
  `
})
export class ModulesComponent {}
TS

# Analytics component (placeholder)
cat > "${PORTAL_PATH}/src/app/components/analytics.component.ts" <<'TS'
import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Analytics</h2>
    <p>Platform-wide analytics will be displayed here.</p>
  `
})
export class AnalyticsComponent {}
TS

# Example service (e.g., platform API)
cat > "${PORTAL_PATH}/src/app/services/api.service.ts" <<'TS'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getTenants(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tenants`);
  }

  getModules(): Observable<any> {
    return this.http.get(`${this.baseUrl}/modules`);
  }

  // Add more methods as needed...
}
TS

# Tailwind config for basic setup and purge
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

# styles.css to include tailwind directives
cat > "${PORTAL_PATH}/src/styles.css" <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
CSS

# Dockerfile to build and serve the Angular app
cat > "${PORTAL_PATH}/Dockerfile" <<'DOCKER'
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/hub-portal /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
DOCKER

echo "✅ ${PORTAL_NAME} portal scaffold complete in ${PORTAL_PATH}."
echo "Next steps:"
echo "  cd ${PORTAL_PATH}"
echo "  npm install"
echo "  ng serve --open"
echo ""
echo "Or to build and run Docker image:"
echo "  docker build -t ${PORTAL_NAME}:latest ."
echo "  docker run -p 4201:80 ${PORTAL_NAME}:latest"
