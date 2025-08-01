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
