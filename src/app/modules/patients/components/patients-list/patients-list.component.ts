// src/app/modules/patients/components/patients-list/patients-list.component.ts
import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Patient } from '../../../../core/models/patient.model';
import { PatientService } from '../../../../core/services/patient.service';
import { Consultation } from '../../../../core/models/consultation.model';
import { ConsultationService } from '../../../../core/services/consultation.service';
import { MatDialog } from '@angular/material/dialog';
import { ConsultationDetailDialogComponent } from '../consultation-form/consultation-detail-dialog.component';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MaterialModule],
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss'],
})

export class PatientsListComponent implements OnInit {
  patients: Patient[] = [];
  filterText = '';
  filteredPatients: Patient[] = [];
  patientNameMap: Record<number, string> = {};
  doctorId?: number | null;
  loading = false;
  error?: string;

  selectedDate: Date | null = null;
  consultationsForDate: Consultation[] = [];
  loadingConsults = false;

  private patientService = inject(PatientService);
  private consultationService = inject(ConsultationService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  // using `filterText` with (ngModelChange) in template

  ngOnInit(): void {
    this.load();
    this.patientService.refresh$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.load());
    try {
      const raw = localStorage.getItem('medilogs_user');
      if (raw) {
        const user = JSON.parse(raw) as { id?: number };
        this.doctorId = user?.id ?? null;
      }
    } catch {
      this.doctorId = null;
    }
  }

  // `filteredPatients` is a mutable array updated by `applyFilter` and `load`

  private load() {
    this.loading = true;
    this.error = undefined;
    this.patientService.list().subscribe({
      next: rows => { this.patients = rows; this.loading = false; this.buildPatientMap(rows); this.filteredPatients = (rows || []).slice(); },
      error: () => { this.error = 'No se pudieron cargar los pacientes.'; this.loading = false; },
    });
  }

  private buildPatientMap(list: Patient[]) {
    try {
      for (const p of list || []) {
        if (p && p.id != null) this.patientNameMap[Number(p.id)] = p.full_name || `Paciente ${p.id}`;
      }
  } catch (e) { console.debug('[patients-list] buildPatientMap error', e); }
  }

  goToConsultations(p: Patient) {
    this.router.navigate(['/patients', p.id, 'consultations']);
  }

  createNew() {
    this.router.navigate(['/patients', 'new']);
  }

  getAge(birth?: string | null): string {
    if (!birth) return '—';
    const bd = new Date(birth);
    if (isNaN(bd.getTime())) return '—';
    const today = new Date();
    let age = today.getFullYear() - bd.getFullYear();
    const m = today.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
    return String(age);
  }

  onDateChange(value: Date | string | null) {
    if (!value) {
      this.selectedDate = null;
      this.consultationsForDate = [];
      return;
    }
    let d: Date | null = null;
    if (value instanceof Date) {
      d = value;
    } else {
      d = new Date(String(value));
    }
    if (!d || isNaN(d.getTime())) {
      this.selectedDate = null;
      this.consultationsForDate = [];
      return;
    }

    d.setHours(0,0,0,0);
    this.selectedDate = d;
    this.loadConsultationsForDate();
  }

  formatDateDDMMYYYY(d?: Date | null): string {
    if (!d) return 'Selecciona una fecha';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear());
    return `${day}/${month}/${year}`;
  }

  private getConsultationDateRaw(obj: Record<string, unknown>): string | undefined {
    const tryField = (k: string) => {
      const v = obj[k];
      return typeof v === 'string' && v.trim() ? (v as string).trim() : undefined;
    };
    return tryField('date') || tryField('record_date') || tryField('created_at') || tryField('updated_at');
  }
  getConsultationTime(c: Consultation): string {
    const raw = this.getConsultationDateRaw(c as unknown as Record<string, unknown>);
    const d = this.parseConsultationDate(raw, true); // preservar hora
    if (!d) return '—';
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  getPatientName(id?: number | null): string {
    if (id == null) return '—';
    const nid = Number(id);
    if (this.patientNameMap[nid]) return this.patientNameMap[nid];
    // lazy fetch single patient and cache
    this.patientService.get(nid).subscribe({ next: p => { if (p?.full_name) this.patientNameMap[nid] = p.full_name; }, error: () => { /* ignore */ } });
    return '';
  }

  openConsultationDetail(c: Consultation) {
    try {
      this.dialog.open(ConsultationDetailDialogComponent, {
        data: c,
        width: '640px'
      });
    } catch (e) {
      console.debug('[patients-list] openConsultationDetail error', e);
    }
  }

  private loadConsultationsForDate() {
    if (!this.selectedDate) return (this.consultationsForDate = []);
    this.loadingConsults = true;
    this.consultationsForDate = [];
  const target = this.toDateKey(this.selectedDate!);

  const serverDate = this.formatDateDDMMYYYY(this.selectedDate!);
  const filters: Record<string,string> = { date: serverDate };
  if (this.doctorId != null) filters.doctor_id = String(this.doctorId);
  this.consultationService.list(undefined, filters).subscribe({
      next: rows => {
        // server may return array or { data: [] }
        const arr: Consultation[] = Array.isArray(rows)
          ? rows
          : (rows && Array.isArray((rows as unknown as { data?: Consultation[] }).data))
            ? (rows as unknown as { data?: Consultation[] }).data || []
            : [];

        if (arr.length) {
          this.consultationsForDate = arr.filter(c => {
            const raw = this.getConsultationDateRaw(c as unknown as Record<string, unknown>);
            const cd = this.parseConsultationDate(raw);
            if (!cd) return false;
            if (this.toDateKey(cd) !== target) return false;
            if (this.doctorId != null && Object.keys(this.patientNameMap).length) {
              return this.patientNameMap[Number((c as unknown as Record<string, unknown>).patient_id)] != null;
            }
            return true;
          });
          this.loadingConsults = false;
        } else {
          this.consultationService.list().subscribe({
            next: all => {
              const full: Consultation[] = Array.isArray(all)
                ? all
                : (all && Array.isArray((all as unknown as { data?: Consultation[] }).data))
                  ? (all as unknown as { data?: Consultation[] }).data || []
                  : [];
              this.consultationsForDate = full.filter(c => {
                const cd = this.parseConsultationDate((c as unknown as Record<string, unknown>).date as string | undefined);
                return cd ? this.toDateKey(cd) === target : false;
              });
              this.loadingConsults = false;
            },
            error: () => { this.consultationsForDate = []; this.loadingConsults = false; }
          });
          return;
        }
      },
      error: () => {
        this.consultationsForDate = [];
        this.loadingConsults = false;
      }
    });
  }
 
  private parseConsultationDate(input: string | undefined | null, preserveTime = false): Date | null {
    if (!input) return null;
    const s = String(input).trim();
    try {
      // Fecha ISO (ej: 2023-12-31T14:30:00Z)
      const dtIso = new Date(s);
      if (!isNaN(dtIso.getTime())) {
        if (!preserveTime) dtIso.setHours(0,0,0,0);
        return dtIso;
      }

      return null;
    } catch {
      return null;
    }
  }

  trackByPatientId(_index: number, p: Patient): number {
    return p.id;
  }

  private applyFilter(query: string) {
    try {
      const q = String(query || '').trim().toLowerCase();
      if (!q) {
        this.filteredPatients = (this.patients || []).slice();
        return;
      }

      const qnum = Number(q);
      const isNumber = q !== '' && !isNaN(qnum);

      this.filteredPatients = (this.patients || []).filter(p => {
        try {
          const name = (p.full_name || '').toString().toLowerCase();
          const insurance = (p.insurance || '').toString().toLowerCase();
          const gender = (p.gender || '').toString().toLowerCase();
          const document = (p.document || '').toString().toLowerCase();
          const ageStr = this.getAge(p.birth_date || null).toString().toLowerCase();

          if (name.includes(q) || insurance.includes(q) || gender.includes(q) || document.includes(q) || ageStr.includes(q)) return true;

          if (isNumber) {
            const age = this.getAgeNumber(p.birth_date);
            if (age != null && age === qnum) return true;
          }

          return false;
        } catch {
          return false;
        }
      });
    } catch {
      this.filteredPatients = (this.patients || []).slice();
    }
  }

  private getAgeNumber(birth?: string | null): number | null {
    if (!birth) return null;
    const bd = new Date(birth);
    if (isNaN(bd.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - bd.getFullYear();
    const m = today.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
    return Number.isFinite(age) ? age : null;
  }

  trackByConsultationId(_index: number, c: Consultation): number {
    return c.id;
  }

  private toDateKey(d: Date) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
}
