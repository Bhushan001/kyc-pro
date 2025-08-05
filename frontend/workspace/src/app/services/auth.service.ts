import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    organization?: string;
  };
  token: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
    console.log('Workspace AuthService: Service initialized');
  }

  login(loginData: LoginData): Observable<AuthResponse> {
    console.log('Workspace AuthService: Login attempt with:', loginData);
    
    // Simulate API call
    return of({
      success: true,
      user: {
        id: '1',
        name: 'Platform User',
        email: loginData.email,
        role: 'platform_user',
        organization: 'TechCorp Inc'
      },
      token: 'mock-jwt-token-' + Date.now(),
      message: 'Login successful'
    }).pipe(delay(1000));
  }

  signup(signupData: SignupData): Observable<AuthResponse> {
    console.log('Workspace AuthService: Signup attempt with:', signupData);
    
    // Simulate API call
    return of({
      success: true,
      user: {
        id: '1',
        name: `${signupData.firstName} ${signupData.lastName}`,
        email: signupData.email,
        role: signupData.role,
        organization: 'TechCorp Inc'
      },
      token: 'mock-jwt-token-' + Date.now(),
      message: 'Account created successfully'
    }).pipe(delay(1500));
  }

  logout(): void {
    console.log('Workspace AuthService: Logout called');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    // Redirect to login page
    window.location.href = '/login';
  }

  redirectUserBasedOnRole(): void {
    console.log('Workspace AuthService: Redirecting user based on role');
    // For Workspace portal, always redirect to dashboard since it's for platform users
    window.location.href = '/dashboard';
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  getCurrentUser(): any {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
} 