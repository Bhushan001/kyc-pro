import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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

interface BackendAuthResponse {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId?: string;
  status: string;
  keycloakId?: string;
  dateOfBirth?: string;
  country?: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
    console.log('Hub AuthService: Service initialized');
  }

  login(loginData: LoginData): Observable<AuthResponse> {
    console.log('Hub AuthService: Login attempt with:', loginData);
    
    return this.http.post<BackendAuthResponse>(`${environment.apiGatewayUrl}${environment.services.auth}/login`, loginData)
      .pipe(
        map((response: BackendAuthResponse) => {
          // Store token and user data
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_data', JSON.stringify({
            id: response.userId,
            name: `${response.firstName} ${response.lastName}`,
            email: response.email,
            role: response.role,
            tenantId: response.tenantId,
            status: response.status
          }));

          return {
            success: true,
            user: {
              id: response.userId,
              name: `${response.firstName} ${response.lastName}`,
              email: response.email,
              role: response.role,
              organization: response.tenantId ? 'Tenant Organization' : 'Kyc-Pro Platform'
            },
            token: response.token,
            message: 'Login successful'
          };
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return of({
            success: false,
            user: {
              id: '',
              name: '',
              email: '',
              role: '',
              organization: ''
            },
            token: '',
            message: error.error?.message || 'Login failed'
          });
        })
      );
  }

  signup(signupData: SignupData): Observable<AuthResponse> {
    console.log('Hub AuthService: Signup attempt with:', signupData);
    
    const backendSignupData = {
      email: signupData.email,
      password: signupData.password,
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      role: signupData.role,
      dateOfBirth: '1990-01-01', // Default value
      country: 'US', // Default value
      phone: '' // Optional
    };

    return this.http.post<BackendAuthResponse>(`${environment.apiGatewayUrl}${environment.services.auth}/signup`, backendSignupData)
      .pipe(
        map((response: BackendAuthResponse) => {
          // Store token and user data
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_data', JSON.stringify({
            id: response.userId,
            name: `${response.firstName} ${response.lastName}`,
            email: response.email,
            role: response.role,
            tenantId: response.tenantId,
            status: response.status
          }));

          return {
            success: true,
            user: {
              id: response.userId,
              name: `${response.firstName} ${response.lastName}`,
              email: response.email,
              role: response.role,
              organization: response.tenantId ? 'Tenant Organization' : 'Kyc-Pro Platform'
            },
            token: response.token,
            message: 'Account created successfully'
          };
        }),
        catchError((error) => {
          console.error('Signup error:', error);
          return of({
            success: false,
            user: {
              id: '',
              name: '',
              email: '',
              role: '',
              organization: ''
            },
            token: '',
            message: error.error?.message || 'Signup failed'
          });
        })
      );
  }

  logout(): void {
    console.log('Hub AuthService: Logout called');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    // Redirect to login page
    window.location.href = '/login';
  }

  redirectUserBasedOnRole(): void {
    console.log('Hub AuthService: Redirecting user based on role');
    // For Hub portal, always redirect to dashboard since it's for platform admins
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

  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }
} 