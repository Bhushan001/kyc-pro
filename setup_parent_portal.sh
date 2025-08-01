#!/bin/bash
set -euo pipefail

PORTAL_NAME="parent-portal"
PORTAL_PATH="frontend/${PORTAL_NAME}"
NG_VERSION="17"

echo "Generating Angular ${PORTAL_NAME} using Angular CLI..."

# Check if Angular CLI is installed, if not install locally
if ! command -v ng &> /dev/null
then
    echo "Angular CLI not found globally. Using npx for Angular CLI..."
fi

# Create the Angular app using Angular CLI
npx --yes @angular/cli@"$NG_VERSION" new "$PORTAL_NAME" \
  --directory "$PORTAL_PATH" \
  --routing=true --style=css --skip-tests --skip-git --skip-install > /dev/null

echo "Replacing default files with custom scaffold..."

# Overwrite main.ts to bootstrap standalone root component
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

# Create app directory and files
mkdir -p "${PORTAL_PATH}/src/app/components"
mkdir -p "${PORTAL_PATH}/src/app/services"

# root standalone AppComponent
cat > "${PORTAL_PATH}/src/app/app.component.ts" <<'TS'
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {}
TS

# Routing configuration
cat > "${PORTAL_PATH}/src/app/app.routes.ts" <<'TS'
import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing.component';
import { LoginComponent } from './components/login.component';
import { SignupComponent } from './components/signup.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '' }
];
TS

# Landing component
cat > "${PORTAL_PATH}/src/app/components/landing.component.ts" <<'TS'
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center space-y-6 px-4">
      <h1 class="text-5xl font-bold text-indigo-700">Welcome to SaaS Platform</h1>
      <p class="max-w-xl text-center text-lg text-indigo-900">
        Access your apps through login. New user? Sign up now.
      </p>
      <div class="space-x-4">
        <a routerLink="/login" class="text-white px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700">Login</a>
        <a routerLink="/signup" class="text-indigo-600 px-6 py-3 border border-indigo-600 rounded-lg hover:bg-indigo-100">Sign Up</a>
      </div>
    </div>
  `
})
export class LandingComponent {}
TS

# Login component
cat > "${PORTAL_PATH}/src/app/components/login.component.ts" <<'TS'
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
  <div class="min-h-screen flex items-center justify-center p-6">
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-5">
      <h2 class="text-2xl font-semibold text-indigo-700">Login</h2>
      
      <input formControlName="email" type="email" placeholder="Email" class="input"/>
      <div *ngIf="form.controls.email.invalid && form.controls.email.touched" class="text-sm text-red-600">Valid email required</div>
      
      <input formControlName="password" type="password" placeholder="Password" class="input"/>
      <div *ngIf="form.controls.password.invalid && form.controls.password.touched" class="text-sm text-red-600">Password required</div>
      
      <button type="submit" [disabled]="form.invalid" class="btn-primary w-full">Sign In</button>
      
      <div *ngIf="error" class="text-red-600 text-sm">{{error}}</div>
      
      <p class="text-xs text-center mt-4">New user? <a routerLink="/signup" class="text-indigo-600 hover:underline">Sign up here</a></p>
    </form>
  </div>
  `,
  styles: [`
    .input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.375rem;
      font-size: 1rem;
      outline-offset: 2px;
    }
    .btn-primary {
      background-color: #4f46e5;
      color: white;
      padding: 0.75rem;
      border-radius: 0.375rem;
      font-weight: 600;
    }
    .btn-primary:disabled {
      background-color: #a5b4fc;
    }
  `]
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  error: string | null = null;

  onSubmit() {
    if (this.form.valid) {
      this.error = null;
      this.authService.login(this.form.value).subscribe({
        next: () => this.authService.redirectUserBasedOnRole(),
        error: (err) => this.error = "Invalid credentials"
      });
    }
  }
}
TS

# Signup component
cat > "${PORTAL_PATH}/src/app/components/signup.component.ts" <<'TS'
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
  <div class="min-h-screen flex items-center justify-center p-6">
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-5">
      <h2 class="text-2xl font-semibold text-indigo-700">Sign Up</h2>

      <input formControlName="name" type="text" placeholder="Full Name" class="input"/>
      <div *ngIf="form.controls.name.invalid && form.controls.name.touched" class="text-sm text-red-600">Name is required</div>

      <input formControlName="email" type="email" placeholder="Email" class="input"/>
      <div *ngIf="form.controls.email.invalid && form.controls.email.touched" class="text-sm text-red-600">Valid email required</div>

      <input formControlName="password" type="password" placeholder="Password" class="input"/>
      <div *ngIf="form.controls.password.invalid && form.controls.password.touched" class="text-sm text-red-600">Password (min 6 chars) required</div>

      <button type="submit" [disabled]="form.invalid" class="btn-primary w-full">Create Account</button>

      <div *ngIf="error" class="text-red-600 text-sm">{{error}}</div>

      <p class="text-xs text-center mt-4">Already have an account? <a routerLink="/login" class="text-indigo-600 hover:underline">Log in</a></p>
    </form>
  </div>
  `,
  styles: [`
    .input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.375rem;
      font-size: 1rem;
      outline-offset: 2px;
    }
    .btn-primary {
      background-color: #4f46e5;
      color: white;
      padding: 0.75rem;
      border-radius: 0.375rem;
      font-weight: 600;
    }
    .btn-primary:disabled {
      background-color: #a5b4fc;
    }
  `]
})
export class SignupComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  error: string | null = null;

  onSubmit() {
    if (this.form.valid) {
      this.error = null;
      this.authService.signup(this.form.value).subscribe({
        next: () => this.authService.redirectUserBasedOnRole(),
        error: () => this.error = "Failed to sign up"
      });
    }
  }
}
TS

# AuthService
cat > "${PORTAL_PATH}/src/app/services/auth.service.ts" <<'TS'
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface AuthResponse {
  token: string;
  refreshToken: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, req).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.currentUserSubject.next(res);
      })
    );
  }

  signup(req: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, req).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.currentUserSubject.next(res);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    window.location.href = '/';
  }

  redirectUserBasedOnRole() {
    const user = this.currentUserSubject.value;
    if (!user) {
      window.location.href = '/login';
      return;
    }
    switch (user.role) {
      case 'platform_admin':
        window.location.href = '/hub';
        break;
      case 'tenant_admin':
        window.location.href = '/console';
        break;
      case 'user':
        window.location.href = '/workspace';
        break;
      default:
        window.location.href = '/login';
    }
  }
}
TS

# Tailwind config file
cat > "${PORTAL_PATH}/tailwind.config.js" <<'JS'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
JS

# styles.css with tailwind imports
cat > "${PORTAL_PATH}/src/styles.css" <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
CSS

# Dockerfile
cat > "${PORTAL_PATH}/Dockerfile" <<'DOCKER'
# Build stage
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/parent-portal /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
DOCKER

# Friendly message
echo "✅ ${PORTAL_NAME} portal scaffold ready at ${PORTAL_PATH}"
echo "Next steps:"
echo "  cd ${PORTAL_PATH}"
echo "  npm install"
echo "  ng serve --open"
echo ""
echo "Or build and run Docker image:"
echo "  docker build -t ${PORTAL_NAME}:latest ."
echo "  docker run -p 4200:80 ${PORTAL_NAME}:latest"
