import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tenant-admin-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tenant-admin-signup.component.html',
  styleUrls: ['./tenant-admin-signup.component.css']
})
export class TenantAdminSignupComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  error: string | null = null;

  // Custom password validator
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const errors: ValidationErrors = {};
    
    if (!hasUpperCase) errors['missingUpperCase'] = true;
    if (!hasLowerCase) errors['missingLowerCase'] = true;
    if (!hasNumbers) errors['missingNumbers'] = true;
    if (!hasSpecialChar) errors['missingSpecialChar'] = true;
    if (!isLongEnough) errors['tooShort'] = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Custom confirm password validator
  confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const confirmPassword = control.value;
    const password = control.parent?.get('password')?.value;
    
    if (!confirmPassword || !password) return null;
    
    return confirmPassword === password ? null : { passwordMismatch: true };
  }

  signupForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]+$/)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    tenantName: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
    confirmPassword: ['', [Validators.required, this.confirmPasswordValidator]],
    agreeToTerms: [false, Validators.requiredTrue]
  });

  // Getter methods for easy template access
  get firstName() { return this.signupForm.get('firstName'); }
  get lastName() { return this.signupForm.get('lastName'); }
  get email() { return this.signupForm.get('email'); }
  get tenantName() { return this.signupForm.get('tenantName'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
  get agreeToTerms() { return this.signupForm.get('agreeToTerms'); }

  // Password strength checker
  getPasswordStrength(): { score: number; label: string; color: string } {
    const password = this.password?.value || '';
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        return { score, label: 'Very Weak', color: 'text-red-500' };
      case 2:
        return { score, label: 'Weak', color: 'text-orange-500' };
      case 3:
        return { score, label: 'Fair', color: 'text-yellow-500' };
      case 4:
        return { score, label: 'Good', color: 'text-blue-500' };
      case 5:
        return { score, label: 'Strong', color: 'text-green-500' };
      default:
        return { score: 0, label: 'Very Weak', color: 'text-red-500' };
    }
  }

  // Password validation methods for template
  hasMinLength(): boolean {
    const password = this.password?.value || '';
    return password.length >= 8;
  }

  hasUpperCase(): boolean {
    const password = this.password?.value || '';
    return /[A-Z]/.test(password);
  }

  hasLowerCase(): boolean {
    const password = this.password?.value || '';
    return /[a-z]/.test(password);
  }

  hasNumbers(): boolean {
    const password = this.password?.value || '';
    return /\d/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.password?.value || '';
    return /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  onSignup() {
    if (this.signupForm.valid) {
      this.error = null;
      this.isLoading = true;

      const signupData = {
        firstname: this.signupForm.value.firstName!,
        lastname: this.signupForm.value.lastName!,
        email: this.signupForm.value.email!,
        dateOfBirth: '1990-01-01', // Default for testing
        country: 'US', // Default for testing
        password: this.signupForm.value.password!,
        role: 'PLATFORM_TENANT_ADMIN',
        termsAccepted: 'true'
      };

      this.authService.signup(signupData).subscribe({
        next: () => {
          this.isLoading = false;
          this.authService.redirectUserBasedOnRole();
        },
        error: (err) => {
          this.isLoading = false;
          this.error = "Signup failed. Please try again.";
          console.error('Signup error:', err);
        }
      });
    }
  }

  // Helper method to check if field has error
  hasError(field: AbstractControl | null, errorType: string): boolean {
    return field ? field.hasError(errorType) && field.touched : false;
  }

  // Helper method to get error message
  getErrorMessage(field: AbstractControl | null, fieldName: string): string {
    if (!field || !field.errors) return '';
    
    if (field.hasError('required')) return `${fieldName} is required`;
    if (field.hasError('email')) return 'Please enter a valid email address';
    if (field.hasError('minlength')) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    if (field.hasError('pattern')) return `${fieldName} contains invalid characters`;
    if (field.hasError('passwordMismatch')) return 'Passwords do not match';
    
    return '';
  }
} 