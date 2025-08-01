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
