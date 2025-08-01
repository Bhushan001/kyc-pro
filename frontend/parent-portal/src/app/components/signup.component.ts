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
  <div class="min-h-screen flex items-center justify-center p-6">
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-5">
      <h2 class="text-2xl font-semibold text-indigo-700">Sign Up</h2>

      <input formControlName="name" type="text" placeholder="Full Name" class="input"/>
      <div *ngIf="form.controls.name.invalid && form.controls.name.touched" class="text-sm text-red-600">Name is required</div>

      <input formControlName="email" type="email" placeholder="Email" class="input"/>
      <div *ngIf="form.controls.email.invalid && form.controls.email.touched" class="text-sm text-red-600">Valid email required</div>

      <input formControlName="password" type="password" placeholder="Password" class="input"/>
      <div *ngIf="form.controls.password.invalid && form.controls.password.touched" class="text-sm text-red-600">Password (min 6 chars) required</div>

      <button type="submit" [disabled]="form.invalid" class="btn-primary w-full">Create Account</button>

      <div *ngIf="error" class="text-red-600 text-sm">{{error}}</div>

      <p class="text-xs text-center mt-4">Already have an account? <a routerLink="/login" class="text-indigo-600 hover:underline">Log in</a></p>
    </form>
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
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  error: string | null = null;

  onSubmit() {
    if (this.form.valid) {
      this.error = null;
      const signupData = {
        name: this.form.value.name!,
        email: this.form.value.email!,
        password: this.form.value.password!
      };
      this.authService.signup(signupData).subscribe({
        next: () => this.authService.redirectUserBasedOnRole(),
        error: () => this.error = "Failed to sign up"
      });
    }
  }
}
