import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from '../../../core/http/api-http.service';
import { Doctor } from '../../../core/models/doctor.model';

@Injectable({ providedIn: 'root' })
export class DoctorsService {
  private readonly base = '/doctors';

  constructor(private api: ApiHttpService) {}

  list(): Observable<Doctor[]> {
    return this.api.get<Doctor[]>(this.base);
  }
  byId(id: string): Observable<Doctor> {
    return this.api.get<Doctor>(`${this.base}/${id}`);
  }
  create(dto: Doctor): Observable<Doctor> {
    return this.api.post<Doctor>(this.base, dto);
  }
  update(id: string, dto: Doctor): Observable<Doctor> {
    return this.api.put<Doctor>(`${this.base}/${id}`, dto);
  }
  patch(id: string, partial: Partial<Doctor>): Observable<Doctor> {
    return this.api.patch<Doctor>(`${this.base}/${id}`, partial);
  }
  remove(id: string): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`);
  }
}