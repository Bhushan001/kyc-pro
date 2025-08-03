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
