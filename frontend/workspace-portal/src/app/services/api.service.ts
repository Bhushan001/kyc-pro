import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tasks`);
  }

  getModules(): Observable<any> {
    return this.http.get(`${this.baseUrl}/modules`);
  }

  // Add more API calls as needed
}
