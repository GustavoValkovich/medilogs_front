import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConsultationsService } from '../services/consultations.service';
import { Consultation } from '../../../core/models/consultation.model';

@Component({
  standalone: true,
  selector: 'app-consultation-list',
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="card">
      <div class="toolbar">
        <h2>Consultations</h2>
        <a routerLink="/consultations/new" class="button primary">Nuevo</a>
      </div>

      <div *ngIf="loading">Cargando...</div>
      <div *ngIf="!loading && consultations.length === 0">Sin registros.</div>

      <table class="table" *ngIf="!loading && consultations.length > 0">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>PatientId</th>
            <th>DoctorId</th>
            <th>Notas</th>
            <th style="width:140px;"></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of consultations">
            <td>{{ c.date | date: 'short' }}</td>
            <td>{{ c.patientId }}</td>
            <td>{{ c.doctorId }}</td>
            <td>{{ c.notes || '-' }}</td>
            <td>
              <a [routerLink]="['/consultations', c.id]" class="button">Editar</a>
              <button class="button danger" (click)="onDelete(c)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ConsultationListComponent implements OnInit {
  private readonly svc = inject(ConsultationsService);
  consultations: Consultation[] = [];
  loading = false;

  ngOnInit(): void { this.fetch(); }

  fetch(): void {
    this.loading = true;
    this.svc.list().subscribe({
      next: (data) => { this.consultations = data; this.loading = false; },
      error: () => { this.loading = false; alert('Error cargando consultas'); },
    });
  }

  onDelete(c: Consultation): void {
    if (!c.id) return;
    if (!confirm(`Eliminar consulta ${c.id}?`)) return;
    this.svc.remove(c.id).subscribe({
      next: () => this.fetch(),
      error: () => alert('No se pudo eliminar'),
    });
  }
}