import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import '../styles/globals.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent],
  template: `
    <app-dashboard></app-dashboard>
  `,
})
export class AppComponent {}
