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
