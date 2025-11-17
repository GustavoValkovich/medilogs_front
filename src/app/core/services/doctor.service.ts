import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Doctor } from '../models/doctor.model';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/api/doctors`;

  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.base}/${id}`);
  }

  updateDoctor(id: number, patch: Partial<Doctor> & { password?: string }): Observable<Doctor> {
    return this.http.patch<Doctor>(`${this.base}/${id}`, patch);
  }
}
