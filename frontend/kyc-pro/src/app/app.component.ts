import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import '../styles/globals.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-background">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  constructor() {
    console.log('AppComponent: Angular app initialized');
  }
}
