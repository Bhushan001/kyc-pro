import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import '../styles/globals.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RouterModule, DashboardComponent],
  template: `
    <app-dashboard></app-dashboard>
  `
})
export class AppComponent {
  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
