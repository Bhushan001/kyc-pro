import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <!-- Beautiful SVG Background -->
      <div class="absolute inset-0 overflow-hidden">
        <svg
          class="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
            </linearGradient>
            <radialGradient id="radial1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle
            cx="200"
            cy="150"
            r="120"
            fill="url(#radial1)"
            class="animate-pulse"
            style="animation-duration: 4s;"
          />
          <circle
            cx="1000"
            cy="600"
            r="80"
            fill="url(#grad1)"
            class="animate-pulse"
            style="animation-duration: 3s; animation-delay: 1s;"
          />

          <path
            d="M100 300 L300 200 L400 400 L200 500 Z"
            fill="url(#grad2)"
            class="animate-pulse"
            style="animation-duration: 5s; animation-delay: 0.5s;"
          />
          
          <path
            d="M800 100 L1100 150 L1000 350 L700 300 Z"
            fill="url(#grad3)"
            class="animate-pulse"
            style="animation-duration: 6s; animation-delay: 2s;"
          />

          <path
            d="M0 400 Q300 200 600 400 T1200 400"
            stroke="url(#grad1)"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
          
          <path
            d="M0 600 Q400 400 800 600 T1200 600"
            stroke="url(#grad2)"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />

          <g class="animate-pulse" style="animation-duration: 3s;">
            <circle cx="150" cy="500" r="4" fill="#3B82F6" opacity="0.6" />
            <circle cx="350" cy="450" r="3" fill="#8B5CF6" opacity="0.4" />
            <circle cx="550" cy="520" r="5" fill="#06B6D4" opacity="0.5" />
          </g>

          <g class="animate-pulse" style="animation-duration: 4s; animation-delay: 1s;">
            <circle cx="850" cy="250" r="4" fill="#3B82F6" opacity="0.6" />
            <circle cx="950" cy="300" r="3" fill="#8B5CF6" opacity="0.4" />
            <circle cx="1050" cy="200" r="5" fill="#06B6D4" opacity="0.5" />
          </g>

          <path
            d="M500 50 Q600 100 500 200 Q400 150 500 50"
            fill="url(#grad1)"
            opacity="0.3"
            class="animate-pulse"
            style="animation-duration: 7s;"
          />

          <path
            d="M700 650 Q800 700 700 750 Q600 700 700 650"
            fill="url(#grad3)"
            opacity="0.2"
            class="animate-pulse"
            style="animation-duration: 5s; animation-delay: 1.5s;"
          />
        </svg>

        <div class="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-bounce" style="animation-duration: 6s;"></div>
        <div class="absolute bottom-32 right-32 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-bounce" style="animation-duration: 8s; animation-delay: 2s;"></div>
        <div class="absolute top-1/2 left-10 w-16 h-16 bg-cyan-500/10 rounded-full blur-lg animate-bounce" style="animation-duration: 5s; animation-delay: 1s;"></div>
        <div class="absolute top-1/3 right-20 w-20 h-20 bg-indigo-500/10 rounded-full blur-lg animate-bounce" style="animation-duration: 7s; animation-delay: 3s;"></div>
      </div>

      <!-- Main Content -->
      <div class="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div class="w-full max-w-lg">
          <!-- Logo and Header -->
          <div class="text-center mb-8">
            <div class="flex items-center justify-center space-x-3 mb-6">
              <div class="relative">
                <svg class="h-12 w-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <svg class="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-4xl font-bold text-white">Kyc-Pro</h1>
                <p class="text-sm text-blue-300 font-medium">Enterprise KYC Platform</p>
              </div>
            </div>
            <p class="text-slate-300 text-lg">Welcome to the future of identity verification</p>
          </div>

          <!-- Auth Card -->
          <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl">
            <!-- Tab Navigation -->
            <div class="grid w-full grid-cols-2 bg-slate-800/50 backdrop-blur-lg border-b border-slate-600/50 rounded-t-lg">
              <button 
                class="px-4 py-4 text-slate-300 font-medium transition-all duration-200 rounded-tl-lg"
                [class]="activeTab === 'login' ? 'bg-blue-600/80 text-white' : 'text-slate-300 hover:text-white'"
                (click)="activeTab = 'login'"
              >
                Sign In
              </button>
              <button 
                class="px-4 py-4 text-slate-300 font-medium transition-all duration-200 rounded-tr-lg"
                [class]="activeTab === 'signup' ? 'bg-blue-600/80 text-white' : 'text-slate-300 hover:text-white'"
                (click)="activeTab = 'signup'"
              >
                Create Account
              </button>
            </div>

            <!-- Login Tab -->
            <div *ngIf="activeTab === 'login'" class="p-6">
              <div class="text-center mb-6">
                <h2 class="text-2xl font-semibold text-white mb-2">Welcome back</h2>
                <p class="text-slate-300 text-base">
                  Sign in to access your dashboard
                </p>
              </div>
              
              <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-5">
                <div class="space-y-3">
                  <label class="text-slate-200 font-medium text-sm">Email Address</label>
                  <div class="relative group">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <input
                      formControlName="email"
                      type="email"
                      placeholder="Enter your email"
                      class="w-full pl-12 h-12 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/25 transition-all duration-200 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
                
                <div class="space-y-3">
                  <label class="text-slate-200 font-medium text-sm">Password</label>
                  <div class="relative group">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <input
                      formControlName="password"
                      [type]="showPassword ? 'text' : 'password'"
                      placeholder="Enter your password"
                      class="w-full pl-12 pr-12 h-12 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/25 transition-all duration-200 rounded-md px-3 py-2"
                      required
                    />
                    <button
                      type="button"
                      (click)="showPassword = !showPassword"
                      class="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <svg *ngIf="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      <svg *ngIf="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <label class="flex items-center space-x-2 text-sm text-slate-300">
                    <input type="checkbox" class="rounded border-slate-600 bg-slate-800/50" />
                    <span>Remember me</span>
                  </label>
                  <button type="button" class="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot password?
                  </button>
                </div>
                
                <button 
                  type="submit" 
                  class="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] rounded-md flex items-center justify-center"
                  [disabled]="loginForm.invalid || isLoading"
                >
                  <div *ngIf="isLoading" class="flex items-center space-x-2">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                  <div *ngIf="!isLoading" class="flex items-center space-x-2">
                    <span>Sign In</span>
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </div>
                </button>
              </form>

              <div class="text-center text-sm text-slate-300 mt-4">
                Demo credentials: any email and password
              </div>
            </div>

            <!-- Signup Tab -->
            <div *ngIf="activeTab === 'signup'" class="p-6">
              <div class="text-center mb-6">
                <h2 class="text-2xl font-semibold text-white mb-2">Create your account</h2>
                <p class="text-slate-300 text-base">
                  Join thousands of organizations using Kyc-Pro
                </p>
              </div>
              
              <form [formGroup]="signupForm" (ngSubmit)="onSignup()" class="space-y-5">
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-3">
                    <label class="text-slate-200 font-medium text-sm">First Name</label>
                    <div class="relative group">
                      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <input
                        formControlName="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        class="w-full pl-12 h-12 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/25 transition-all duration-200 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                  
                  <div class="space-y-3">
                    <label class="text-slate-200 font-medium text-sm">Last Name</label>
                    <div class="relative group">
                      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <input
                        formControlName="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        class="w-full pl-12 h-12 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/25 transition-all duration-200 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div class="space-y-3">
                  <label class="text-slate-200 font-medium text-sm">Email Address</label>
                  <div class="relative group">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <input
                      formControlName="email"
                      type="email"
                      placeholder="Enter your email"
                      class="w-full pl-12 h-12 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/25 transition-all duration-200 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div class="space-y-3">
                  <label class="text-slate-200 font-medium text-sm">Select Your Role</label>
                  <div class="relative group">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                    <select
                      formControlName="role"
                      class="w-full pl-12 h-12 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-white focus:border-blue-400/50 focus:ring-blue-400/25 transition-all duration-200 rounded-md px-3 py-2 appearance-none cursor-pointer"
                      required
                    >
                      <option value="" class="bg-slate-800 text-white">Choose your role</option>
                      <option value="platform_admin" class="bg-slate-800 text-white">Platform Administrator</option>
                      <option value="platform_tenant_admin" class="bg-slate-800 text-white">Tenant Administrator</option>
                      <option value="platform_user" class="bg-slate-800 text-white">Platform User</option>
                    </select>
                    <svg class="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>

                <div *ngIf="signupForm.get('role')?.value === 'platform_tenant_admin'" class="space-y-3">
                  <label class="text-slate-200 font-medium text-sm">Organization Name</label>
                  <div class="relative group">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <input
                      formControlName="tenantName"
                      type="text"
                      placeholder="Enter your organization name"
                      class="w-full pl-12 h-12 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-400/50 focus:ring-purple-400/25 transition-all duration-200 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div class="space-y-3">
                  <label class="text-slate-200 font-medium text-sm">Password</label>
                  <div class="relative group">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <input
                      formControlName="password"
                      [type]="showPassword ? 'text' : 'password'"
                      placeholder="Create a strong password"
                      class="w-full pl-12 pr-12 h-12 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/25 transition-all duration-200 rounded-md px-3 py-2"
                      required
                    />
                    <button
                      type="button"
                      (click)="showPassword = !showPassword"
                      class="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <svg *ngIf="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      <svg *ngIf="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="space-y-3">
                  <label class="text-slate-200 font-medium text-sm">Confirm Password</label>
                  <div class="relative group">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <input
                      formControlName="confirmPassword"
                      [type]="showConfirmPassword ? 'text' : 'password'"
                      placeholder="Confirm your password"
                      class="w-full pl-12 pr-12 h-12 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/25 transition-all duration-200 rounded-md px-3 py-2"
                      required
                    />
                    <button
                      type="button"
                      (click)="showConfirmPassword = !showConfirmPassword"
                      class="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <svg *ngIf="!showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      <svg *ngIf="showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                      </svg>
                    </button>
                  </div>
                  <div *ngIf="signupForm.get('confirmPassword')?.touched && signupForm.get('confirmPassword')?.value !== signupForm.get('password')?.value" 
                       class="text-sm text-red-400 mt-1">
                    Passwords do not match
                  </div>
                </div>

                <div class="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    formControlName="agreeToTerms"
                    class="rounded border-slate-600 bg-slate-800/50 mt-1" 
                    required 
                  />
                  <label class="text-sm text-slate-300 leading-relaxed">
                    I agree to the <a href="#" class="text-blue-400 hover:text-blue-300">Terms of Service</a> and <a href="#" class="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  class="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] rounded-md flex items-center justify-center"
                  [disabled]="signupForm.invalid || isLoading || !passwordsMatch()"
                >
                  <div *ngIf="isLoading" class="flex items-center space-x-2">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating account...</span>
                  </div>
                  <div *ngIf="!isLoading" class="flex items-center space-x-2">
                    <span>Create Account</span>
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </div>
                </button>
              </form>
            </div>
          </div>

          <!-- Footer -->
          <div class="text-center mt-8 space-y-4">
            <div class="flex justify-center space-x-6">
              <div class="inline-flex items-center rounded-full border border-white/20 text-white/80 bg-white/5 backdrop-blur-sm border-blue-400/30 px-3 py-1">
                <svg class="h-3 w-3 mr-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Platform
              </div>
              <div class="inline-flex items-center rounded-full border border-white/20 text-white/80 bg-white/5 backdrop-blur-sm border-purple-400/30 px-3 py-1">
                <svg class="h-3 w-3 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Tenant
              </div>
              <div class="inline-flex items-center rounded-full border border-white/20 text-white/80 bg-white/5 backdrop-blur-sm border-green-400/30 px-3 py-1">
                <svg class="h-3 w-3 mr-1 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                User
              </div>
            </div>
            <p class="text-slate-400 text-sm">
              Trusted by 500+ organizations worldwide for secure identity verification
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  activeTab: 'login' | 'signup' = 'login';
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  error: string | null = null;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  signupForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    tenantName: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    agreeToTerms: [false, Validators.requiredTrue]
  });

  onLogin() {
    if (this.loginForm.valid) {
      this.error = null;
      this.isLoading = true;
      
      const loginData = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };
      
      this.authService.login(loginData).subscribe({
        next: () => {
          this.isLoading = false;
          this.authService.redirectUserBasedOnRole();
        },
        error: (err) => {
          this.isLoading = false;
          this.error = "Invalid credentials. Please try again.";
        }
      });
    }
  }

  onSignup() {
    if (this.signupForm.valid && this.passwordsMatch()) {
      this.error = null;
      this.isLoading = true;
      
      const signupData = {
        firstName: this.signupForm.value.firstName!,
        lastName: this.signupForm.value.lastName!,
        email: this.signupForm.value.email!,
        role: this.signupForm.value.role!,
        tenantName: this.signupForm.value.tenantName,
        password: this.signupForm.value.password!
      };
      
      // Mock signup - in real app, this would call the auth service
      setTimeout(() => {
        this.isLoading = false;
        this.authService.redirectUserBasedOnRole();
      }, 1500);
    }
  }

  passwordsMatch(): boolean {
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }
}
