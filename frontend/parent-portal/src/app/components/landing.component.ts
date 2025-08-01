import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center space-y-6 px-4">
      <h1 class="text-5xl font-bold text-indigo-700">Welcome to SaaS Platform</h1>
      <p class="max-w-xl text-center text-lg text-indigo-900">
        Access your apps through login. New user? Sign up now.
      </p>
      <div class="space-x-4">
        <a routerLink="/login" class="text-white px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700">Login</a>
        <a routerLink="/signup" class="text-indigo-600 px-6 py-3 border border-indigo-600 rounded-lg hover:bg-indigo-100">Sign Up</a>
      </div>
    </div>
  `
})
export class LandingComponent {}
