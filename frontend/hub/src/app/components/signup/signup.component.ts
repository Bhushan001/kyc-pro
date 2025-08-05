import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthBackgroundSvgComponent } from '../auth-background-svg/auth-background-svg.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthBackgroundSvgComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  error: string | null = null;

  constructor() {
    console.log('Hub SignupComponent: Component initialized');
  }

  signupForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required, 
      Validators.minLength(8),
      this.passwordValidator
    ]],
    confirmPassword: ['', [Validators.required]],
    agreeToTerms: [false, [Validators.requiredTrue]]
  }, { validators: this.passwordMatchValidator });

  get firstName() { return this.signupForm.get('firstName'); }
  get lastName() { return this.signupForm.get('lastName'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
  get agreeToTerms() { return this.signupForm.get('agreeToTerms'); }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const errors: ValidationErrors = {};
    if (!hasUpperCase) errors['missingUpperCase'] = true;
    if (!hasLowerCase) errors['missingLowerCase'] = true;
    if (!hasNumbers) errors['missingNumbers'] = true;
    if (!hasSpecialChar) errors['missingSpecialChar'] = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  getPasswordStrength(): { score: number; label: string; color: string } {
    const value = this.password?.value || '';
    let score = 0;
    
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) score++;

    if (score >= 4) return { score, label: 'Strong', color: 'text-green-600' };
    if (score >= 3) return { score, label: 'Good', color: 'text-blue-600' };
    if (score >= 2) return { score, label: 'Fair', color: 'text-yellow-600' };
    return { score, label: 'Weak', color: 'text-red-600' };
  }

  hasMinLength(): boolean {
    return (this.password?.value || '').length >= 8;
  }

  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.password?.value || '');
  }

  hasLowerCase(): boolean {
    return /[a-z]/.test(this.password?.value || '');
  }

  hasNumbers(): boolean {
    return /\d/.test(this.password?.value || '');
  }

  hasSpecialChar(): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.password?.value || '');
  }

  hasError(control: AbstractControl | null, errorType: string): boolean {
    return control?.hasError(errorType) || false;
  }

  getErrorMessage(control: AbstractControl | null, fieldName: string): string {
    if (!control?.errors) return '';

    if (control.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `${fieldName} must be at least ${requiredLength} characters`;
    }
    if (control.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }

    return `${fieldName} is invalid`;
  }

  onSignup() {
    console.log('Hub SignupComponent: Form submitted');
    console.log('Hub SignupComponent: Form valid:', this.signupForm.valid);
    console.log('Hub SignupComponent: Form values:', this.signupForm.value);
    
    if (this.signupForm.valid) {
      this.error = null;
      this.isLoading = true;
      
      const signupData = {
        firstName: this.signupForm.value.firstName!,
        lastName: this.signupForm.value.lastName!,
        email: this.signupForm.value.email!,
        password: this.signupForm.value.password!,
        role: 'platform_admin'
      };
      
      console.log('Hub SignupComponent: Attempting signup with:', signupData);
      
      this.authService.signup(signupData).subscribe({
        next: (response) => {
          console.log('Hub SignupComponent: Signup successful:', response);
          this.isLoading = false;
          this.authService.redirectUserBasedOnRole();
        },
        error: (err) => {
          console.error('Hub SignupComponent: Signup error:', err);
          this.isLoading = false;
          this.error = err.error?.message || "Signup failed. Please try again.";
        }
      });
    } else {
      console.log('Hub SignupComponent: Form is invalid');
      console.log('Hub SignupComponent: Form errors:', this.signupForm.errors);
    }
  }
} 