import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientsService } from '../services/patients.service';
import { Patient } from '../../../core/models/patient.model';

@Component({
  standalone: true,
  selector: 'app-patient-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <div class="toolbar">
        <h2>Patients</h2>
        <a routerLink="/patients/new" class="button primary">Nuevo</a>
      </div>

      <div *ngIf="loading">Cargando...</div>
      <div *ngIf="!loading && patients.length === 0">Sin registros.</div>

      <table class="table" *ngIf="!loading && patients.length > 0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Email</th>
            <th style="width:140px;"></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of patients">
            <td>{{ p.firstName }} {{ p.lastName }}</td>
            <td>{{ p.documentNumber || '-' }}</td>
            <td>{{ p.email || '-' }}</td>
            <td>
              <a [routerLink]="['/patients', p.id]" class="button">Editar</a>
              <button class="button danger" (click)="onDelete(p)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class PatientListComponent implements OnInit {
  private readonly svc = inject(PatientsService);
  patients: Patient[] = [];
  loading = false;

  ngOnInit(): void { this.fetch(); }

  fetch(): void {
    this.loading = true;
    this.svc.list().subscribe({
      next: (data) => { this.patients = data; this.loading = false; },
      error: (e) => { this.loading = false; alert('Error cargando pacientes'); }, // por visibilidad inmediata
    });
  }

  onDelete(p: Patient): void {
    if (!p.id) return;
    if (!confirm(`Eliminar a ${p.firstName} ${p.lastName}?`)) return;
    this.svc.remove(p.id).subscribe({
      next: () => this.fetch(),
      error: () => alert('No se pudo eliminar'),
    });
  }
}