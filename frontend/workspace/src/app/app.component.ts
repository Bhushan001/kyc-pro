import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import '../styles/globals.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col bg-background">
      <nav class="bg-card shadow px-6 py-4 flex justify-between items-center border-b border-border">
        <div class="text-xl font-bold text-foreground">Workspace Portal</div>
        <button class="text-sm text-muted-foreground hover:text-foreground" (click)="logout()">Logout</button>
      </nav>
      <div class="flex flex-1">
        <aside class="w-64 bg-muted p-4 space-y-4">
          <a routerLink="/workspace/dashboard" routerLinkActive="font-bold text-foreground" class="block py-2 hover:text-foreground text-muted-foreground">Dashboard</a>
          <a routerLink="/workspace/tasks" routerLinkActive="font-bold text-foreground" class="block py-2 hover:text-foreground text-muted-foreground">Tasks</a>
          <a routerLink="/workspace/kanban" routerLinkActive="font-bold text-foreground" class="block py-2 hover:text-foreground text-muted-foreground">Kanban</a>
          <a routerLink="/workspace/modules" routerLinkActive="font-bold text-foreground" class="block py-2 hover:text-foreground text-muted-foreground">Modules</a>
          <a routerLink="/workspace/reports" routerLinkActive="font-bold text-foreground" class="block py-2 hover:text-foreground text-muted-foreground">Reports</a>
        </aside>
        <main class="flex-1 p-6 overflow-auto bg-background">
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
