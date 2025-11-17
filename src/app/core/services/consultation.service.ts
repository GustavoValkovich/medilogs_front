import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Consultation } from '../models/consultation.model';

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  private base = `${environment.apiBase}/api/consultations`;
  private http = inject(HttpClient);

  list(patientId?: number, filters?: Record<string, string>): Observable<Consultation[]> {
    const params: Record<string,string> = {};
    if (patientId != null) params.patient_id = String(patientId);
    if (filters) {
      for (const k of Object.keys(filters)) {
        const v = filters[k];
        if (v != null) params[k] = String(v);
      }
    }
    return this.http.get<Consultation[]>(`${this.base}/`, { params: Object.keys(params).length ? params as unknown as Record<string,string> : undefined });
  }
  get(id: number): Observable<Consultation> { return this.http.get<Consultation>(`${this.base}/${id}`); }
  create(body: Partial<Consultation> & { patient_id: number }): Observable<Consultation> { return this.http.post<Consultation>(`${this.base}/`, body); }
  update(id: number, body: Consultation): Observable<Consultation> { return this.http.put<Consultation>(`${this.base}/${id}`, body); }
  patch(id: number, body: Partial<Consultation>): Observable<Consultation> { return this.http.patch<Consultation>(`${this.base}/${id}`, body); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }

  softDelete(id: number, deleted_at?: string): Observable<Consultation> {
    return this.http.post<Consultation>(`${this.base}/${id}/soft-delete`, { deleted_at });
  }

  restore(id: number): Observable<Consultation> {
    return this.http.post<Consultation>(`${this.base}/${id}/restore`, {});
  }
}
