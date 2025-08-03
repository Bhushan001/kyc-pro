import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  tenantId: string | null;
  keycloakId: string | null;
  status: string;
  dateOfBirth: string | null;
  country: string | null;
  phone: string | null;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  firstname: string;
  lastname: string;
  email: string;
  dateOfBirth: string;
  country: string;
  password: string;
  role: string;
  termsAccepted: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = `${environment.apiGatewayUrl}${environment.services.auth}`;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  login(req: LoginRequest): Observable<AuthResponse> {
    const loginUrl = `${this.baseUrl}/login`;
    console.log('AuthService: Making login request to:', loginUrl);
    
    return this.http.post<AuthResponse>(loginUrl, req).pipe(
      tap((res) => {
        console.log('AuthService: Login successful, response:', res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.currentUserSubject.next(res);
      }),
      catchError((error) => {
        console.error('AuthService: Login error:', error);
        throw error;
      })
    );
  }

  signup(req: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, req).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.currentUserSubject.next(res);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  redirectUserBasedOnRole() {
    const user = this.currentUserSubject.value;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    switch (user.role) {
      case 'PLATFORM_ADMIN':
        // Navigate to hub for platform admins
        window.location.href = environment.portals.hub;
        break;
      case 'PLATFORM_TENANT_ADMIN':
        this.router.navigate(['/dashboard']);
        break;
      case 'PLATFORM_USER':
        this.router.navigate(['/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}
