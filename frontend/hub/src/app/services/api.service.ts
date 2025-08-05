import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: string;
  plan: string;
  settings?: any;
  branding?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId?: string;
  status: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface CreateTenantRequest {
  name: string;
  domain: string;
  plan: string;
  settings?: any;
  branding?: any;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId?: string;
  dateOfBirth: string;
  country: string;
  phone?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiGatewayUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Health check method
  checkBackendHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/actuator/health`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Tenant Management
  getTenants(): Observable<Tenant[]> {
    console.log('Fetching tenants from:', `${this.baseUrl}${environment.services.tenant}`);
    return this.http.get<Tenant[]>(`${this.baseUrl}${environment.services.tenant}`, { headers: this.getHeaders() })
      .pipe(
        map(tenants => {
          console.log('Tenants loaded:', tenants);
          return tenants;
        }),
        catchError(this.handleError)
      );
  }

  getTenantById(id: string): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.baseUrl}${environment.services.tenant}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  createTenant(tenantData: CreateTenantRequest): Observable<Tenant> {
    console.log('Creating tenant:', tenantData);
    return this.http.post<Tenant>(`${this.baseUrl}${environment.services.tenant}`, tenantData, { headers: this.getHeaders() })
      .pipe(
        map(tenant => {
          console.log('Tenant created:', tenant);
          return tenant;
        }),
        catchError(this.handleError)
      );
  }

  updateTenant(id: string, tenantData: CreateTenantRequest): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.baseUrl}${environment.services.tenant}/${id}`, tenantData, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteTenant(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${environment.services.tenant}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // User Management
  getUsers(): Observable<User[]> {
    console.log('Fetching users from:', `${this.baseUrl}${environment.services.user}`);
    return this.http.get<User[]>(`${this.baseUrl}${environment.services.user}`, { headers: this.getHeaders() })
      .pipe(
        map(users => {
          console.log('Users loaded:', users);
          return users;
        }),
        catchError(this.handleError)
      );
  }

  getUsersByTenant(tenantId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}${environment.services.user}/tenant/${tenantId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}${environment.services.user}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}${environment.services.user}`, userData, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateUser(id: string, userData: Partial<CreateUserRequest>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}${environment.services.user}/${id}`, userData, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${environment.services.user}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Module Management
  getModules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}${environment.services.module}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Subscription Management
  getSubscriptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}${environment.services.subscription}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Registry Management
  getRegistryData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}${environment.services.registry}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Dashboard Statistics
  getDashboardStats(): Observable<any> {
    // This would be a custom endpoint that aggregates data from multiple services
    return this.http.get<any>(`${this.baseUrl}/dashboard/stats`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.status ? `${error.status}: ${error.message}` : 'Server error';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
