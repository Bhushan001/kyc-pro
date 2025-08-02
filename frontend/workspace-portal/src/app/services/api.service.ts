import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiGatewayUrl;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any> {
    return this.http.get(`${this.baseUrl}${environment.services.user}/tasks`);
  }

  getModules(): Observable<any> {
    return this.http.get(`${this.baseUrl}${environment.services.module}`);
  }

  // Add more API calls as needed
}
