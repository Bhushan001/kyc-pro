import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import '../styles/globals.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen flex flex-col bg-background">
      <nav class="bg-card shadow py-4 px-6 flex justify-between items-center border-b border-border">
        <div class="text-xl font-bold text-foreground">Platform HUB</div>
        <button class="text-sm text-muted-foreground hover:text-foreground" (click)="logout()">Logout</button>
      </nav>
      <div class="flex flex-1">
        <aside class="w-64 bg-muted p-4 space-y-4">
          <a routerLink="/hub/dashboard" routerLinkActive="font-bold text-foreground" class="block py-2 hover:text-foreground text-muted-foreground">Dashboard</a>
          <a routerLink="/hub/tenants" routerLinkActive="font-bold text-foreground" class="block py-2 hover:text-foreground text-muted-foreground">Tenants</a>
          <a routerLink="/hub/modules" routerLinkActive="font-bold text-foreground" class="block py-2 hover:text-foreground text-muted-foreground">Modules</a>
          <a routerLink="/hub/analytics" routerLinkActive="font-bold text-foreground" class="block py-2 hover:text-foreground text-muted-foreground">Analytics</a>
        </aside>
        <main class="flex-1 p-6 bg-background overflow-auto">
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
