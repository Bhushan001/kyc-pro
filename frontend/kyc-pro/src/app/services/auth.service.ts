import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
  refreshToken: string;
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  tenantId: string;
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
  private baseUrl = `${environment.apiGatewayUrl}${environment.services.auth}`;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, req).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.currentUserSubject.next(res);
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
    window.location.href = '/';
  }

  redirectUserBasedOnRole() {
    const user = this.currentUserSubject.value;
    if (!user) {
      window.location.href = '/login';
      return;
    }
    switch (user.role) {
      case 'platform_admin':
        window.location.href = '/hub';
        break;
      case 'tenant_admin':
        window.location.href = '/console';
        break;
      case 'user':
        window.location.href = '/workspace';
        break;
      default:
        window.location.href = '/login';
    }
  }
}
