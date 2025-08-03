import { Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard.component';
import { TenantsComponent } from './components/tenants.component';
import { ModulesComponent } from './components/modules.component';
import { AnalyticsComponent } from './components/analytics.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tenants', component: TenantsComponent },
  { path: 'modules', component: ModulesComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: '**', redirectTo: '' }
];
