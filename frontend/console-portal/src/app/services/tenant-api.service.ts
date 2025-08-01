import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TenantApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getUsers(tenantId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/tenant/${tenantId}`);
  }

  getSubscriptions(tenantId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/subscriptions/tenant/${tenantId}`);
  }

  // Add more API calls here...
}
