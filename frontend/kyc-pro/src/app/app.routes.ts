import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { PlatformAdminSignupComponent } from './components/platform-admin-signup/platform-admin-signup.component';
import { TenantAdminSignupComponent } from './components/tenant-admin-signup/tenant-admin-signup.component';
import { UserSignupComponent } from './components/user-signup/user-signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ErrorComponent } from './components/error/error.component';

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
