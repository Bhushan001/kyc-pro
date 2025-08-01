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
