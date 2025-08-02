import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TenantApiService {
  private baseUrl = environment.apiGatewayUrl;

  constructor(private http: HttpClient) {}

  getUsers(tenantId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${environment.services.user}/tenant/${tenantId}`);
  }

  getSubscriptions(tenantId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${environment.services.subscription}/tenant/${tenantId}`);
  }

  // Add more API calls here...
}
