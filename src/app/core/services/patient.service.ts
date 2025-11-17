import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Patient } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private base = `${environment.apiBase}/api/patients`;
  private _refresh$ = new Subject<void>();
  private http = inject(HttpClient);
  list(): Observable<Patient[]> {

    try {
      const raw = localStorage.getItem('medilogs_user');
      if (raw) {
        const user = JSON.parse(raw) as { id?: number };
        if (user?.id != null) {

          const params = new HttpParams().set('doctor_id', String(user.id));
          return this.http.get<Patient[]>(`${this.base}/`, { params });
        }
      }
    } catch (err) {
      console.warn('No se emcuentra el paciente:', err);
    }

    return this.http.get<Patient[]>(`${this.base}/`);
  }
  get(id: number): Observable<Patient> { return this.http.get<Patient>(`${this.base}/${id}`); }
  create(body: Partial<Patient>): Observable<Patient> {
    return this.http.post<Patient>(`${this.base}/`, body).pipe(tap(() => this._refresh$.next()));
  }
  update(id: number, body: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.base}/${id}`, body).pipe(tap(() => this._refresh$.next()));
  }
  patch(id: number, body: Partial<Patient>): Observable<Patient> { return this.http.patch<Patient>(`${this.base}/${id}`, body); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`).pipe(tap(() => this._refresh$.next())); }

  softDelete(id: number, deleted_at?: string): Observable<Patient> {
    // Revert to soft-delete endpoint in backend: POST /api/patients/:id/soft-delete
    return this.http.post<Patient>(`${this.base}/${id}/soft-delete`, { deleted_at }).pipe(tap(() => this._refresh$.next()));
  }

  restore(id: number): Observable<Patient> {
    return this.http.post<Patient>(`${this.base}/${id}/restore`, {}).pipe(tap(() => this._refresh$.next()));
  }


  get refresh$(): Observable<void> { return this._refresh$.asObservable(); }
}
