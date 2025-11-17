import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Doctor } from '../models/doctor.model';

export interface LoginResponse {
  user: Doctor;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/api/doctors`;

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, credentials);
  }

  signup(payload: {
    first_name: string;
    last_name: string;
    email: string;
    license_number: string;
    password: string;
    specialty?: string;
    phone?: string;
  }): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.base}`, payload);
  }
}
