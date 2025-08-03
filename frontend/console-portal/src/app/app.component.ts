import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';
import '../styles/globals.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col bg-background">
      <nav class="bg-card shadow py-4 px-6 flex justify-between items-center border-b border-border">
        <div class="text-xl font-bold text-foreground">Console Portal</div>
        <button
          class="text-sm text-muted-foreground hover:text-foreground"
          (click)="logout()"
        >
          Logout
        </button>
      </nav>
      <div class="flex flex-1 bg-muted">
        <aside class="w-64 bg-card p-5 border-r border-border space-y-3">
          <a
            routerLink="/console/dashboard"
            routerLinkActive="font-bold text-foreground"
            class="block py-2 hover:text-foreground text-muted-foreground"
            >Dashboard</a
          >
          <a
            routerLink="/console/users"
            routerLinkActive="font-bold text-foreground"
            class="block py-2 hover:text-foreground text-muted-foreground"
            >Users</a
          >
          <a
            routerLink="/console/subscriptions"
            routerLinkActive="font-bold text-foreground"
            class="block py-2 hover:text-foreground text-muted-foreground"
            >Subscriptions</a
          >
          <a
            routerLink="/console/billing"
            routerLinkActive="font-bold text-foreground"
            class="block py-2 hover:text-foreground text-muted-foreground"
            >Billing</a
          >
          <a
            routerLink="/console/settings"
            routerLinkActive="font-bold text-foreground"
            class="block py-2 hover:text-foreground text-muted-foreground"
            >Settings</a
          >
          <a
            routerLink="/console/reports"
            routerLinkActive="font-bold text-foreground"
            class="block py-2 hover:text-foreground text-muted-foreground"
            >Reports</a
          >
        </aside>
        <main class="flex-1 p-6 overflow-auto bg-background">
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
