import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from '../../../core/http/api-http.service';
import { Patient } from '../../../core/models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientsService {
  private readonly base = '/patients';

  constructor(private api: ApiHttpService) {}

  list(): Observable<Patient[]> {
    return this.api.get<Patient[]>(this.base);
  }
  byId(id: string): Observable<Patient> {
    return this.api.get<Patient>(`${this.base}/${id}`);
  }
  create(dto: Patient): Observable<Patient> {
    return this.api.post<Patient>(this.base, dto);
  }
  update(id: string, dto: Patient): Observable<Patient> {
    return this.api.put<Patient>(`${this.base}/${id}`, dto);
  }
  patch(id: string, partial: Partial<Patient>): Observable<Patient> {
    return this.api.patch<Patient>(`${this.base}/${id}`, partial);
  }
  remove(id: string): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`);
  }
}