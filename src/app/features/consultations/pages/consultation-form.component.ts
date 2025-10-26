import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConsultationsService } from '../services/consultations.service';
import { PatientsService } from '../../patients/services/patients.service';
import { DoctorsService } from '../../doctors/services/doctors.service';
import { Consultation } from '../../../core/models/consultation.model';
import { Patient } from '../../../core/models/patient.model';
import { Doctor } from '../../../core/models/doctor.model';

@Component({
  standalone: true,
  selector: 'app-consultation-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="card">
      <div class="toolbar">
        <h2>{{ isEdit ? 'Editar Consulta' : 'Nueva Consulta' }}</h2>
        <a routerLink="/consultations" class="button">Volver</a>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="row">
        <div class="col">
          <label>Paciente</label>
          <select class="select" formControlName="patientId">
            <option [ngValue]="null">-- Seleccionar --</option>
            <option *ngFor="let p of patients" [value]="p.id">
              {{ p.firstName }} {{ p.lastName }}
            </option>
          </select>
        </div>

        <div class="col">
          <label>Médico</label>
          <select class="select" formControlName="doctorId">
            <option [ngValue]="null">-- Seleccionar --</option>
            <option *ngFor="let d of doctors" [value]="d.id">
              {{ d.firstName }} {{ d.lastName }} ({{ d.specialty || '—' }})
            </option>
          </select>
        </div>

        <div class="col">
          <label>Fecha/Hora</label>
          <input class="input" type="datetime-local" formControlName="date" />
        </div>

        <div class="col" style="flex:1 1 100%;">
          <label>Notas</label>
          <textarea class="input" formControlName="notes" rows="4"></textarea>
        </div>

        <div style="width:100%; display:flex; gap:8px; margin-top:12px;">
          <button class="button" type="button" (click)="onCancel()">Cancelar</button>
          <button class="button primary" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class ConsultationFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(ConsultationsService);
  private readonly patientsSvc = inject(PatientsService);
  private readonly doctorsSvc = inject(DoctorsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loading = false;
  isEdit = false;
  id: string | null = null;

  patients: Patient[] = [];
  doctors: Doctor[] = [];

  form = this.fb.group({
    patientId: [null as string | null, [Validators.required]],
    doctorId:  [null as string | null, [Validators.required]],
    date:      ['', [Validators.required]],
    notes:     [''],
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;
    this.loadRefs();

    if (this.isEdit && this.id) {
      this.loading = true;
      this.svc.byId(this.id).subscribe({
        next: (c) => {
          // Si el back guarda ISO, convertir a 'yyyy-MM-ddTHH:mm' para el input
          const iso = c.date;
          const local = iso?.slice(0,16); // simple; ajustar si viene con Z
          this.form.patchValue({ ...c, date: local } as any);
          this.loading = false;
        },
        error: () => { this.loading = false; alert('No se pudo cargar la consulta'); },
      });
    }
  }

  loadRefs(): void {
    this.patientsSvc.list().subscribe({ next: (p) => this.patients = p });
    this.doctorsSvc.list().subscribe({ next: (d) => this.doctors = d });
  }

  onCancel(): void { this.router.navigate(['/consultations']); }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: Consultation = {
      patientId: v.patientId!,
      doctorId: v.doctorId!,
      date: this.toIso(v.date as string),
      notes: v.notes || '',
    };

    this.loading = true;
    const obs = this.isEdit && this.id
      ? this.svc.update(this.id, payload)
      : this.svc.create(payload);

    obs.subscribe({
      next: () => { this.loading = false; this.router.navigate(['/consultations']); },
      error: () => { this.loading = false; alert('No se pudo guardar'); },
    });
  }

  // Por qué: normaliza el datetime-local a ISO simple
  private toIso(local: string): string {
    try {
      // local: 'YYYY-MM-DDTHH:mm'
      const d = new Date(local);
      return d.toISOString();
    } catch { return local; }
  }
}
