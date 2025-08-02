import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
  <div class="min-h-screen flex items-center justify-center p-6 bg-gray-50">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Create Your Account</h2>
      
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Personal Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input formControlName="firstname" type="text" placeholder="First Name" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <div *ngIf="form.controls.firstname.invalid && form.controls.firstname.touched" 
                 class="text-sm text-red-600 mt-1">First name is required</div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input formControlName="lastname" type="text" placeholder="Last Name" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <div *ngIf="form.controls.lastname.invalid && form.controls.lastname.touched" 
                 class="text-sm text-red-600 mt-1">Last name is required</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input formControlName="email" type="email" placeholder="Email" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <div *ngIf="form.controls.email.invalid && form.controls.email.touched" 
                 class="text-sm text-red-600 mt-1">Valid email required</div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <input formControlName="dateOfBirth" type="date" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <div *ngIf="form.controls.dateOfBirth.invalid && form.controls.dateOfBirth.touched" 
                 class="text-sm text-red-600 mt-1">Date of birth is required</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <select formControlName="country" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select Country</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Australia">Australia</option>
              <option value="India">India</option>
              <option value="Japan">Japan</option>
              <option value="Brazil">Brazil</option>
              <option value="Mexico">Mexico</option>
            </select>
            <div *ngIf="form.controls.country.invalid && form.controls.country.touched" 
                 class="text-sm text-red-600 mt-1">Country is required</div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input formControlName="password" type="password" placeholder="Password (min 6 characters)" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <div *ngIf="form.controls.password.invalid && form.controls.password.touched" 
                 class="text-sm text-red-600 mt-1">Password (min 6 chars) required</div>
          </div>
        </div>

        <!-- Role Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Select Your Role *</label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="border rounded-lg p-4 cursor-pointer transition-colors"
                 [class.border-indigo-500]="form.controls.role.value === 'platform_admin'"
                 [class.bg-indigo-50]="form.controls.role.value === 'platform_admin'"
                 (click)="selectRole('platform_admin')">
              <div class="flex items-center">
                <input type="radio" formControlName="role" value="platform_admin" class="mr-2">
                <div>
                  <div class="font-medium">Platform Admin</div>
                  <div class="text-sm text-gray-600">Manage the entire platform</div>
                </div>
              </div>
            </div>
            
            <div class="border rounded-lg p-4 cursor-pointer transition-colors"
                 [class.border-indigo-500]="form.controls.role.value === 'tenant_admin'"
                 [class.bg-indigo-50]="form.controls.role.value === 'tenant_admin'"
                 (click)="selectRole('tenant_admin')">
              <div class="flex items-center">
                <input type="radio" formControlName="role" value="tenant_admin" class="mr-2">
                <div>
                  <div class="font-medium">Tenant Admin</div>
                  <div class="text-sm text-gray-600">Manage your organization</div>
                </div>
              </div>
            </div>
            
            <div class="border rounded-lg p-4 cursor-pointer transition-colors"
                 [class.border-indigo-500]="form.controls.role.value === 'user'"
                 [class.bg-indigo-50]="form.controls.role.value === 'user'"
                 (click)="selectRole('user')">
              <div class="flex items-center">
                <input type="radio" formControlName="role" value="user" class="mr-2">
                <div>
                  <div class="font-medium">User</div>
                  <div class="text-sm text-gray-600">Use the platform features</div>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="form.controls.role.invalid && form.controls.role.touched" 
               class="text-sm text-red-600 mt-1">Please select a role</div>
        </div>

        <!-- Terms and Conditions -->
        <div class="border rounded-lg p-4">
          <div class="flex items-start">
            <input type="checkbox" formControlName="termsAccepted" class="mt-1 mr-3">
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-700 mb-2">
                I accept the Terms and Conditions and Privacy Policy
              </div>
              <div class="text-xs text-gray-600 max-h-32 overflow-y-auto border rounded p-2 bg-gray-50">
                <strong>Terms and Conditions:</strong><br>
                By creating an account, you agree to our terms of service. You will be responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password.<br><br>
                <strong>Privacy Policy:</strong><br>
                We collect and use your personal information to provide and improve our services. Your data is protected and will not be shared with third parties without your consent. You have the right to access, modify, or delete your personal information at any time.<br><br>
                <strong>Data Processing:</strong><br>
                Your data will be processed in accordance with applicable data protection laws. We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </div>
            </div>
          </div>
          <div *ngIf="form.controls.termsAccepted.invalid && form.controls.termsAccepted.touched" 
               class="text-sm text-red-600 mt-1">You must accept the terms and conditions</div>
        </div>

        <button type="submit" [disabled]="form.invalid || isLoading" 
                class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
          <span *ngIf="!isLoading">Create Account</span>
          <span *ngIf="isLoading">Creating Account...</span>
        </button>

        <div *ngIf="error" class="text-red-600 text-sm text-center bg-red-50 p-3 rounded">{{error}}</div>

        <p class="text-sm text-center text-gray-600">
          Already have an account? 
          <a routerLink="/login" class="text-indigo-600 hover:underline font-medium">Log in</a>
        </p>
      </form>
    </div>
  </div>
  `,
  styles: [`
    .input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.375rem;
      font-size: 1rem;
      outline-offset: 2px;
    }
    .btn-primary {
      background-color: #4f46e5;
      color: white;
      padding: 0.75rem;
      border-radius: 0.375rem;
      font-weight: 600;
    }
    .btn-primary:disabled {
      background-color: #a5b4fc;
    }
  `]
})
export class SignupComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  form = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dateOfBirth: ['', Validators.required],
    country: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required],
    termsAccepted: [false, [Validators.required, Validators.requiredTrue]]
  });

  error: string | null = null;
  isLoading = false;

  selectRole(role: string) {
    this.form.patchValue({ role });
  }

  onSubmit() {
    if (this.form.valid) {
      this.error = null;
      this.isLoading = true;
      
      const signupData = {
        firstname: this.form.value.firstname!,
        lastname: this.form.value.lastname!,
        email: this.form.value.email!,
        dateOfBirth: this.form.value.dateOfBirth!,
        country: this.form.value.country!,
        password: this.form.value.password!,
        role: this.form.value.role!,
        termsAccepted: this.form.value.termsAccepted!.toString()
      };
      
      this.authService.signup(signupData).subscribe({
        next: () => {
          this.isLoading = false;
          this.authService.redirectUserBasedOnRole();
        },
        error: (err) => {
          this.isLoading = false;
          this.error = "Failed to create account. Please try again.";
          console.error('Signup error:', err);
        }
      });
    }
  }
}
