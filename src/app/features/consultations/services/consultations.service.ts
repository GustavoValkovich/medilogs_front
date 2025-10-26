import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from '../../../core/http/api-http.service';
import { Consultation } from '../../../core/models/consultation.model';

@Injectable({ providedIn: 'root' })
export class ConsultationsService {
  private readonly base = '/consultations';

  constructor(private api: ApiHttpService) {}

  list(): Observable<Consultation[]> {
    return this.api.get<Consultation[]>(this.base);
  }
  byId(id: string): Observable<Consultation> {
    return this.api.get<Consultation>(`${this.base}/${id}`);
  }
  create(dto: Consultation): Observable<Consultation> {
    return this.api.post<Consultation>(this.base, dto);
  }
  update(id: string, dto: Consultation): Observable<Consultation> {
    return this.api.put<Consultation>(`${this.base}/${id}`, dto);
  }
  patch(id: string, partial: Partial<Consultation>): Observable<Consultation> {
    return this.api.patch<Consultation>(`${this.base}/${id}`, partial);
  }
  remove(id: string): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`);
  }
}