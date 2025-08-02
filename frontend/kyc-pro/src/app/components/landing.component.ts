import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div class="flex items-center">
              <div class="text-2xl font-bold text-indigo-600">SaaS Platform</div>
            </div>
            <div class="space-x-4">
              <a routerLink="/login" class="text-gray-600 hover:text-indigo-600 font-medium">Login</a>
              <a routerLink="/signup" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium">Get Started</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Multi-Tenant
            <span class="text-indigo-600">SaaS Platform</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive platform designed for organizations of all sizes. 
            Manage users, modules, and subscriptions with enterprise-grade security and scalability.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/signup" 
               class="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
              Start Free Trial
            </a>
            <a routerLink="/login" 
               class="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors">
              Sign In
            </a>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
          <p class="text-lg text-gray-600">Everything you need to manage your SaaS business</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-lg shadow-lg">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Multi-Tenant Architecture</h3>
            <p class="text-gray-600">Isolated tenant environments with secure data separation and role-based access control.</p>
          </div>
          
          <div class="bg-white p-8 rounded-lg shadow-lg">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Subscription Management</h3>
            <p class="text-gray-600">Flexible billing cycles, module subscriptions, and usage tracking for your business.</p>
          </div>
          
          <div class="bg-white p-8 rounded-lg shadow-lg">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Scalable Modules</h3>
            <p class="text-gray-600">Add or remove modules as your business grows with our modular architecture.</p>
          </div>
        </div>
      </div>

      <!-- Role-Based Portals -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Role-Based Access</h2>
          <p class="text-lg text-gray-600">Different interfaces for different user roles</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-lg shadow-lg border-l-4 border-blue-500">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Platform Admin</h3>
            <p class="text-gray-600 mb-4">Manage the entire platform, view analytics, and oversee all tenants.</p>
            <div class="text-sm text-blue-600 font-medium">Access: Hub Portal</div>
          </div>
          
          <div class="bg-white p-8 rounded-lg shadow-lg border-l-4 border-green-500">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Tenant Admin</h3>
            <p class="text-gray-600 mb-4">Manage your organization, users, and subscriptions within your tenant.</p>
            <div class="text-sm text-green-600 font-medium">Access: Console Portal</div>
          </div>
          
          <div class="bg-white p-8 rounded-lg shadow-lg border-l-4 border-purple-500">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">User</h3>
            <p class="text-gray-600 mb-4">Use platform features, manage tasks, and collaborate with your team.</p>
            <div class="text-sm text-purple-600 font-medium">Access: Workspace Portal</div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-indigo-600 py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p class="text-xl text-indigo-100 mb-8">Join thousands of organizations using our platform</p>
          <a routerLink="/signup" 
             class="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
            Create Your Account
          </a>
        </div>
      </div>

      <!-- Footer -->
      <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <div class="text-2xl font-bold mb-4">SaaS Platform</div>
            <p class="text-gray-400 mb-8">Enterprise-grade multi-tenant SaaS solution</p>
            <div class="flex justify-center space-x-6">
              <a href="#" class="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" class="text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" class="text-gray-400 hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingComponent {}
