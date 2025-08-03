import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  showPassword = false;
  isLoading = false;
  error: string | null = null;

  constructor() {
    console.log('LoginComponent: Component initialized');
  }

  onFormSubmit() {
    console.log('LoginComponent: Form submitted via ngSubmit');
    this.onLogin();
  }

  onButtonClick() {
    console.log('LoginComponent: Submit button clicked');
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  seedLoginData() {
    this.loginForm.patchValue({
      email: 'bhushangadekar01@gmail.com',
      password: 'Bhushan@123'
    });
  }

  onLogin() {
    console.log('LoginComponent: Form submitted');
    console.log('LoginComponent: Form valid:', this.loginForm.valid);
    console.log('LoginComponent: Form values:', this.loginForm.value);
    
    if (this.loginForm.valid) {
      this.error = null;
      this.isLoading = true;
      
      const loginData = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };
      
      console.log('LoginComponent: Attempting login with:', loginData);
      
      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('LoginComponent: Login successful:', response);
          this.isLoading = false;
          this.authService.redirectUserBasedOnRole();
        },
        error: (err) => {
          console.error('LoginComponent: Login error:', err);
          this.isLoading = false;
          this.error = err.error?.message || "Invalid credentials. Please try again.";
        }
      });
    } else {
      console.log('LoginComponent: Form is invalid');
      console.log('LoginComponent: Form errors:', this.loginForm.errors);
      console.log('LoginComponent: Email errors:', this.loginForm.get('email')?.errors);
      console.log('LoginComponent: Password errors:', this.loginForm.get('password')?.errors);
    }
  }
} 