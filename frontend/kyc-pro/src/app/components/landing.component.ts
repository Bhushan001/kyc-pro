import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <!-- Header -->
      <header class="relative z-10 px-5 py-4">
        <nav class="w-full flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <svg class="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <span class="text-2xl font-bold text-white">Kyc-Pro</span>
          </div>
          <div class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" class="text-slate-300 hover:text-white transition-colors">Pricing</a>
            <a href="#about" class="text-slate-300 hover:text-white transition-colors">About</a>
            <a routerLink="/login" class="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-4 py-2">
              Sign In
            </a>
          </div>
        </nav>
      </header>

      <!-- Hero Section -->
      <section class="relative px-5 py-20">
        <div class="w-full text-center">
          <div class="absolute inset-0 overflow-hidden">
            <div class="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div class="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"></div>
          </div>
          
          <div class="relative z-10">
            <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Enterprise-Grade
              <span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                KYC Platform
              </span>
            </h1>
            <p class="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Streamline identity verification with our multi-tenant SaaS platform. 
              Built for compliance, scalability, and seamless user experience.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a routerLink="/login" class="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-12 text-lg">
                Start Free Trial
                <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </a>
              <button class="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 h-12 text-lg">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="px-8 py-20 bg-slate-800/50 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p class="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to manage KYC processes across multiple tenants
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-slate-800/80 border border-slate-700 rounded-lg hover:border-blue-500/50 transition-colors">
              <div class="flex flex-col space-y-1.5 p-6">
                <svg class="h-12 w-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <h3 class="text-2xl font-semibold leading-none tracking-tight text-white">Multi-Tenant Architecture</h3>
              </div>
              <div class="p-6 pt-0">
                <p class="text-slate-400">
                  Secure tenant isolation with role-based access control for platform admins, tenant admins, and users.
                </p>
              </div>
            </div>

            <div class="bg-slate-800/80 border border-slate-700 rounded-lg hover:border-blue-500/50 transition-colors">
              <div class="flex flex-col space-y-1.5 p-6">
                <svg class="h-12 w-12 text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                <h3 class="text-2xl font-semibold leading-none tracking-tight text-white">Role Management</h3>
              </div>
              <div class="p-6 pt-0">
                <p class="text-slate-400">
                  Granular permissions system with dedicated dashboards for each user role and responsibility level.
                </p>
              </div>
            </div>

            <div class="bg-slate-800/80 border border-slate-700 rounded-lg hover:border-blue-500/50 transition-colors">
              <div class="flex flex-col space-y-1.5 p-6">
                <svg class="h-12 w-12 text-yellow-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <h3 class="text-2xl font-semibold leading-none tracking-tight text-white">Real-time Processing</h3>
              </div>
              <div class="p-6 pt-0">
                <p class="text-slate-400">
                  Lightning-fast identity verification with automated workflows and instant compliance reporting.
                </p>
              </div>
            </div>

            <div class="bg-slate-800/80 border border-slate-700 rounded-lg hover:border-blue-500/50 transition-colors">
              <div class="flex flex-col space-y-1.5 p-6">
                <svg class="h-12 w-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <h3 class="text-2xl font-semibold leading-none tracking-tight text-white">Analytics Dashboard</h3>
              </div>
              <div class="p-6 pt-0">
                <p class="text-slate-400">
                  Comprehensive reporting and analytics with customizable metrics for all stakeholder levels.
                </p>
              </div>
            </div>

            <div class="bg-slate-800/80 border border-slate-700 rounded-lg hover:border-blue-500/50 transition-colors">
              <div class="flex flex-col space-y-1.5 p-6">
                <svg class="h-12 w-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="text-2xl font-semibold leading-none tracking-tight text-white">Compliance Ready</h3>
              </div>
              <div class="p-6 pt-0">
                <p class="text-slate-400">
                  Built-in compliance features for global regulations including GDPR, AML, and industry standards.
                </p>
              </div>
            </div>

            <div class="bg-slate-800/80 border border-slate-700 rounded-lg hover:border-blue-500/50 transition-colors">
              <div class="flex flex-col space-y-1.5 p-6">
                <svg class="h-12 w-12 text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                <h3 class="text-2xl font-semibold leading-none tracking-tight text-white">API Integration</h3>
              </div>
              <div class="p-6 pt-0">
                <p class="text-slate-400">
                  Robust REST APIs and webhooks for seamless integration with existing business systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section id="pricing" class="px-8 py-20">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
            <p class="text-xl text-slate-400 max-w-2xl mx-auto">
              Choose the plan that fits your organization's needs
            </p>
          </div>
          
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-slate-800/80 border border-slate-700 rounded-lg">
              <div class="flex flex-col space-y-1.5 p-6 text-center">
                <h3 class="text-2xl font-semibold leading-none tracking-tight text-white">Starter</h3>
                <div class="text-3xl font-bold text-white">$99<span class="text-lg text-slate-400">/month</span></div>
                <p class="text-slate-400">Perfect for small teams</p>
              </div>
              <div class="p-6 pt-0 space-y-4">
                <div class="space-y-3">
                  <div class="flex items-center text-slate-300">
                    <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Up to 1,000 verifications/month
                  </div>
                  <div class="flex items-center text-slate-300">
                    <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    3 tenant organizations
                  </div>
                  <div class="flex items-center text-slate-300">
                    <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Basic analytics
                  </div>
                  <div class="flex items-center text-slate-300">
                    <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Email support
                  </div>
                </div>
                <a routerLink="/login" class="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 hover:bg-blue-700 text-white w-full px-4 py-2">
                  Get Started
                </a>
              </div>
            </div>

            <div class="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500 rounded-lg">
              <div class="flex flex-col space-y-1.5 p-6 text-center">
                <div class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm mb-4 inline-block">Most Popular</div>
                <h3 class="text-2xl font-semibold leading-none tracking-tight text-white">Professional</h3>
                <div class="text-3xl font-bold text-white">$299<span class="text-lg text-slate-400">/month</span></div>
                <p class="text-slate-400">For growing businesses</p>
              </div>
              <div class="p-6 pt-0 space-y-4">
                <div class="space-y-3">
                  <div class="flex items-center text-slate-300">
                    <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Up to 10,000 verifications/month
                  </div>
                  <div class="flex items-center text-slate-300">
                    <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Unlimited tenant organizations
                  </div>
                  <div class="flex items-center text-slate-300">
                    <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Advanced analytics
                  </div>
                  <div class="flex items-center text-slate-300">
                    <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Priority support
                  </div>
                  <div class="flex items-center text-slate-300">
                    <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    API access
                  </div>
                </div>
                <a routerLink="/login" class="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 hover:bg-blue-700 text-white w-full px-4 py-2">
                  Get Started
                </a>
              </div>
            </div>

            <div class="bg-slate-800/80 border border-slate-700 rounded-lg">
              <div class="flex flex-col space-y-1.5 p-6 text-center">
                <h3 class="text-2xl font-semibold leading-none tracking-tight text-white">Enterprise</h3>
                <div class="text-3xl font-bold text-white">Custom</div>
                <p class="text-slate-400">For large organizations</p>
              </div>
              <div class="p-6 pt-0 space-y-4">
                <div class="space-y-3">
                  <div class="flex items-center text-slate-300">
                    <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Unlimited verifications
                  </div>
                  <div class="flex items-center text-slate-300">
                    <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Custom integrations
                  </div>
                  <div class="flex items-center text-slate-300">
                    <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Dedicated support
                  </div>
                  <div class="flex items-center text-slate-300">
                    <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    SLA guarantees
                  </div>
                  <div class="flex items-center text-slate-300">
                    <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    White-label options
                  </div>
                </div>
                <button class="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border border-slate-600 text-slate-300 hover:bg-slate-800 w-full px-4 py-2">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="px-5 py-12 bg-slate-900 border-t border-slate-800">
        <div class="w-full text-center">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <span class="text-xl font-bold text-white">Kyc-Pro</span>
          </div>
          <p class="text-slate-400 mb-4">Enterprise-grade KYC solutions for the modern world</p>
          <div class="flex justify-center space-x-6 text-slate-500">
            <a href="#" class="hover:text-white transition-colors">Privacy</a>
            <a href="#" class="hover:text-white transition-colors">Terms</a>
            <a href="#" class="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingComponent {}
