import { Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TasksComponent } from './components/applications/tasks.component';
import { KanbanComponent } from './components/applications/kanban.component';
import { ModulesComponent } from './components/applications/modules.component';
import { ReportsComponent } from './components/applications/reports.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'kanban', component: KanbanComponent },
  { path: 'modules', component: ModulesComponent },
  { path: 'reports', component: ReportsComponent },
  { path: '**', redirectTo: '/login' }
];
