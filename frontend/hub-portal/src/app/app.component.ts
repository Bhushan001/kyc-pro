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
