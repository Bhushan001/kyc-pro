#!/bin/bash
set -euo pipefail

PORTAL_NAME="console-portal"
PORTAL_PATH="frontend/${PORTAL_NAME}"
NG_VERSION="17"

echo "Generating Angular ${PORTAL_NAME} using Angular CLI..."

# Generate Angular app scaffold
npx --yes @angular/cli@"${NG_VERSION}" new "${PORTAL_NAME}" \
  --directory "${PORTAL_PATH}" \
  --routing=true --style=css --skip-tests --skip-git --skip-install >/dev/null 2>&1

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

# Remove default src/app content and create structure
rm -rf "${PORTAL_PATH}/src/app"
mkdir -p "${PORTAL_PATH}/src/app/components"
mkdir -p "${PORTAL_PATH}/src/app/services"

# Root app component with sidebar suitable for tenant admin console
cat > "${PORTAL_PATH}/src/app/app.component.ts" <<'TS'
import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col">
      <nav class="bg-white shadow py-4 px-6 flex justify-between items-center">
        <div class="text-xl font-bold text-green-700">Console Portal</div>
        <button
          class="text-sm text-green-600 hover:text-green-900"
          (click)="logout()"
        >
          Logout
        </button>
      </nav>
      <div class="flex flex-1 bg-gray-50">
        <aside class="w-64 bg-white p-5 border-r space-y-3">
          <a
            routerLink="/console/dashboard"
            routerLinkActive="font-bold text-green-700"
            class="block py-2 hover:text-green-700"
            >Dashboard</a
          >
          <a
            routerLink="/console/users"
            routerLinkActive="font-bold text-green-700"
            class="block py-2 hover:text-green-700"
            >Users</a
          >
          <a
            routerLink="/console/subscriptions"
            routerLinkActive="font-bold text-green-700"
            class="block py-2 hover:text-green-700"
            >Subscriptions</a
          >
          <a
            routerLink="/console/billing"
            routerLinkActive="font-bold text-green-700"
            class="block py-2 hover:text-green-700"
            >Billing</a
          >
          <a
            routerLink="/console/settings"
            routerLinkActive="font-bold text-green-700"
            class="block py-2 hover:text-green-700"
            >Settings</a
          >
          <a
            routerLink="/console/reports"
            routerLinkActive="font-bold text-green-700"
            class="block py-2 hover:text-green-700"
            >Reports</a
          >
        </aside>
        <main class="flex-1 p-6 overflow-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class AppComponent {
  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
TS

# Routing configuration
cat > "${PORTAL_PATH}/src/app/app.routes.ts" <<'TS'
import { Routes } from '@angular/router';

import { ConsoleDashboardComponent } from './components/console-dashboard.component';
import { UsersComponent } from './components/users.component';
import { SubscriptionsComponent } from './components/subscriptions.component';
import { BillingComponent } from './components/billing.component';
import { SettingsComponent } from './components/settings.component';
import { ReportsComponent } from './components/reports.component';

export const routes: Routes = [
  { path: '', redirectTo: '/console/dashboard', pathMatch: 'full' },
  { path: 'console/dashboard', component: ConsoleDashboardComponent },
  { path: 'console/users', component: UsersComponent },
  { path: 'console/subscriptions', component: SubscriptionsComponent },
  { path: 'console/billing', component: BillingComponent },
  { path: 'console/settings', component: SettingsComponent },
  { path: 'console/reports', component: ReportsComponent },
  { path: '**', redirectTo: '/console/dashboard' },
];
TS

# Components - placeholders with minimal templates

cat > "${PORTAL_PATH}/src/app/components/console-dashboard.component.ts" <<'TS'
import { Component } from '@angular/core';

@Component({
  selector: 'app-console-dashboard',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Dashboard</h2>
    <p>Tenant admin dashboard overview coming soon.</p>
  `,
})
export class ConsoleDashboardComponent {}
TS

cat > "${PORTAL_PATH}/src/app/components/users.component.ts" <<'TS'
import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Users</h2>
    <p>User management interface will be implemented here.</p>
  `,
})
export class UsersComponent {}
TS

cat > "${PORTAL_PATH}/src/app/components/subscriptions.component.ts" <<'TS'
import { Component } from '@angular/core';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Subscriptions</h2>
    <p>Manage tenant subscriptions here.</p>
  `,
})
export class SubscriptionsComponent {}
TS

cat > "${PORTAL_PATH}/src/app/components/billing.component.ts" <<'TS'
import { Component } from '@angular/core';

@Component({
  selector: 'app-billing',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Billing</h2>
    <p>Billing management and invoices will be here.</p>
  `,
})
export class BillingComponent {}
TS

cat > "${PORTAL_PATH}/src/app/components/settings.component.ts" <<'TS'
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Settings</h2>
    <p>Tenant customization and settings panel.</p>
  `,
})
export class SettingsComponent {}
TS

cat > "${PORTAL_PATH}/src/app/components/reports.component.ts" <<'TS'
import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  standalone: true,
  template: `
    <h2 class="text-3xl font-semibold mb-4">Reports</h2>
    <p>Reports and analytics for tenant usage.</p>
  `,
})
export class ReportsComponent {}
TS

# Sample service to interact with backend API
cat > "${PORTAL_PATH}/src/app/services/tenant-api.service.ts" <<'TS'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TenantApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getUsers(tenantId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/tenant/${tenantId}`);
  }

  getSubscriptions(tenantId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/subscriptions/tenant/${tenantId}`);
  }

  // Add more API calls here...
}
TS

# Tailwind CSS config for portal
cat > "${PORTAL_PATH}/tailwind.config.js" <<'JS'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: { extend: {} },
  plugins: [],
}
JS

# Tailwind CSS import in styles.css
cat > "${PORTAL_PATH}/src/styles.css" <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
CSS

# Dockerfile for building and serving Angular portal via nginx
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
COPY --from=build /app/dist/console-portal /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
DOCKER

echo "✅ ${PORTAL_NAME} portal scaffold complete at ${PORTAL_PATH}."
echo "Next steps:"
echo "  cd ${PORTAL_PATH}"
echo "  npm install"
echo "  ng serve --open"
echo ""
echo "Or build and run Docker:"
echo "  docker build -t ${PORTAL_NAME}:latest ."
echo "  docker run -p 4202:80 ${PORTAL_NAME}:latest"
