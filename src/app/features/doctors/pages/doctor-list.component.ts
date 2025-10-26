import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorsService } from '../services/doctors.service';
import { Doctor } from '../../../core/models/doctor.model';

@Component({
  standalone: true,
  selector: 'app-doctor-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <div class="toolbar">
        <h2>Doctors</h2>
        <a routerLink="/doctors/new" class="button primary">Nuevo</a>
      </div>

      <div *ngIf="loading">Cargando...</div>
      <div *ngIf="!loading && doctors.length === 0">Sin registros.</div>

      <table class="table" *ngIf="!loading && doctors.length > 0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Email</th>
            <th style="width:140px;"></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let d of doctors">
            <td>{{ d.firstName }} {{ d.lastName }}</td>
            <td>{{ d.specialty || '-' }}</td>
            <td>{{ d.email || '-' }}</td>
            <td>
              <a [routerLink]="['/doctors', d.id]" class="button">Editar</a>
              <button class="button danger" (click)="onDelete(d)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class DoctorListComponent implements OnInit {
  private readonly svc = inject(DoctorsService);
  doctors: Doctor[] = [];
  loading = false;

  ngOnInit(): void { this.fetch(); }

  fetch(): void {
    this.loading = true;
    this.svc.list().subscribe({
      next: (data) => { this.doctors = data; this.loading = false; },
      error: () => { this.loading = false; alert('Error cargando doctores'); },
    });
  }

  onDelete(d: Doctor): void {
    if (!d.id) return;
    if (!confirm(`Eliminar a ${d.firstName} ${d.lastName}?`)) return;
    this.svc.remove(d.id).subscribe({
      next: () => this.fetch(),
      error: () => alert('No se pudo eliminar'),
    });
  }
}
