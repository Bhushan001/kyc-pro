import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthBackgroundSvgComponent } from '../auth-background-svg/auth-background-svg.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthBackgroundSvgComponent],
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
    console.log('Console LoginComponent: Component initialized');
  }

  onFormSubmit() {
    console.log('Console LoginComponent: Form submitted via ngSubmit');
    this.onLogin();
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  handleDemoLogin() {
    console.log('Console LoginComponent: Demo login for platform tenant admin');
    this.isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
      const demoUser = {
        email: 'tenant.admin@icici.com',
        password: 'demo123'
      };
      
      console.log('Console LoginComponent: Demo login successful for:', demoUser);
      this.isLoading = false;
      
      // Update form with demo data
      this.loginForm.patchValue({
        email: demoUser.email,
        password: demoUser.password
      });
      
      // Simulate successful login
      this.authService.login(demoUser).subscribe({
        next: (response) => {
          console.log('Console LoginComponent: Demo login successful:', response);
          this.authService.redirectUserBasedOnRole();
        },
        error: (err) => {
          console.error('Console LoginComponent: Demo login error:', err);
          this.error = err.error?.message || "Demo login failed. Please try again.";
        }
      });
    }, 500);
  }

  onLogin() {
    console.log('Console LoginComponent: Form submitted');
    console.log('Console LoginComponent: Form valid:', this.loginForm.valid);
    console.log('Console LoginComponent: Form values:', this.loginForm.value);
    
    if (this.loginForm.valid) {
      this.error = null;
      this.isLoading = true;
      
      const loginData = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };
      
      console.log('Console LoginComponent: Attempting login with:', loginData);
      
      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('Console LoginComponent: Login successful:', response);
          this.isLoading = false;
          this.authService.redirectUserBasedOnRole();
        },
        error: (err) => {
          console.error('Console LoginComponent: Login error:', err);
          this.isLoading = false;
          this.error = err.error?.message || "Invalid credentials. Please try again.";
        }
      });
    } else {
      console.log('Console LoginComponent: Form is invalid');
      console.log('Console LoginComponent: Form errors:', this.loginForm.errors);
      console.log('Console LoginComponent: Email errors:', this.loginForm.get('email')?.errors);
      console.log('Console LoginComponent: Password errors:', this.loginForm.get('password')?.errors);
    }
  }
} 