import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DoctorsService } from '../services/doctors.service';
import { Doctor } from '../../../core/models/doctor.model';

@Component({
  standalone: true,
  selector: 'app-doctor-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="card">
      <div class="toolbar">
        <h2>{{ isEdit ? 'Editar Doctor' : 'Nuevo Doctor' }}</h2>
        <a routerLink="/doctors" class="button">Volver</a>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="row">
        <div class="col">
          <label>Nombre</label>
          <input class="input" formControlName="firstName" />
        </div>
        <div class="col">
          <label>Apellido</label>
          <input class="input" formControlName="lastName" />
        </div>
        <div class="col">
          <label>Especialidad</label>
          <input class="input" formControlName="specialty" />
        </div>
        <div class="col">
          <label>Email</label>
          <input class="input" type="email" formControlName="email" />
        </div>
        <div class="col">
          <label>Teléfono</label>
          <input class="input" formControlName="phone" />
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
export class DoctorFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(DoctorsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loading = false;
  isEdit = false;
  id: string | null = null;

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName:  ['', [Validators.required, Validators.minLength(2)]],
    specialty: [''],
    email: ['', [Validators.email]],
    phone: [''],
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;
    if (this.isEdit && this.id) {
      this.loading = true;
      this.svc.byId(this.id).subscribe({
        next: (d) => { this.form.patchValue(d as any); this.loading = false; },
        error: () => { this.loading = false; alert('No se pudo cargar el doctor'); },
      });
    }
  }

  onCancel(): void { this.router.navigate(['/doctors']); }

  onSubmit(): void {
    if (this.form.invalid) return;
    const payload: Doctor = this.form.value as Doctor;
    this.loading = true;
    const obs = this.isEdit && this.id
      ? this.svc.update(this.id, payload)
      : this.svc.create(payload);
    obs.subscribe({
      next: () => { this.loading = false; this.router.navigate(['/doctors']); },
      error: () => { this.loading = false; alert('No se pudo guardar'); },
    });
  }
}