import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { UserStorageService } from './core/services/user-storage.service';
import { DoctorService } from './core/services/doctor.service';
import { Doctor } from './core/models/doctor.model';
import { MaterialModule } from './shared/material.module';
import { NegatoscopioComponent } from './shared/negatoscopio/negatoscopio.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, NegatoscopioComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  @ViewChild('drawer') drawer?: MatSidenav;

  doctorData: {
    first_name?: string;
    last_name?: string;
    specialty?: string;
    phone?: string;
    email?: string;
    license_number?: string;
    password?: string;
  } = {};

  constructor(
    private router: Router,
    private userStorage: UserStorageService,
    private doctorService: DoctorService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  get isLoggedIn(): boolean {
    return this.userStorage.isLoggedIn();
  }

  get isAuthRoute(): boolean {
    const url = this.router.url || '';
    return url.startsWith('/auth/');
  }

  get doctorName(): string | null {
    const doctor = this.userStorage.getDoctor();
    if (!doctor) return null;
    const first = doctor.first_name ?? '';
    const last = doctor.last_name ?? '';
    const full = `${first} ${last}`.trim();
    return full || doctor.email || null;
  }

  logout(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: {
        title: 'Cerrar sesión',
        message: '¿Estás seguro de que quieres cerrar sesión?',
      },
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userStorage.clear();
        this.snack.open('Sesión cerrada', 'OK', { duration: 2000 });
        this.router.navigate(['/auth/login']);
      }
    });
  }

  openDoctorPanel(): void {
    this.loadDoctorData();
    try {
      this.drawer?.open();
    } catch {
      // ignore
    }
  }

  closeDoctorPanel(): void {
    try {
      this.drawer?.close();
    } catch {
      // ignore
    }
  }

  private loadDoctorData(): void {
    const doctor = this.userStorage.getDoctor();
    if (!doctor) {
      this.doctorData = {};
      return;
    }

    const id = doctor.id;
    if (!id) {
      // fallback a lo que tengamos en storage
      this.doctorData = {
        first_name: doctor.first_name ?? '',
        last_name: doctor.last_name ?? '',
        specialty: doctor.specialty ?? '',
        phone: doctor.phone ?? '',
        email: doctor.email ?? '',
        license_number: doctor.license_number ?? '',
        password: '',
      };
      return;
    }

    this.doctorService.getDoctor(id).subscribe({
      next: (doc) => {
        this.doctorData = {
          first_name: doc.first_name ?? doctor.first_name ?? '',
          last_name: doc.last_name ?? doctor.last_name ?? '',
          specialty: doc.specialty ?? doctor.specialty ?? '',
          phone: doc.phone ?? doctor.phone ?? '',
          email: doc.email ?? doctor.email ?? '',
          license_number: doc.license_number ?? doctor.license_number ?? '',
          password: '',
        };
      },
      error: () => {
        this.doctorData = {
          first_name: doctor.first_name ?? '',
          last_name: doctor.last_name ?? '',
          specialty: doctor.specialty ?? '',
          phone: doctor.phone ?? '',
          email: doctor.email ?? '',
          license_number: doctor.license_number ?? '',
          password: '',
        };
      },
    });
  }

  saveDoctor(): void {
    const current = this.userStorage.getDoctor();
    if (!current) {
      this.snack.open('No se encontró usuario en sesión', 'OK', { duration: 2500 });
      return;
    }

    const id = current.id;
    if (!id) {
      this.snack.open('No se pudo determinar el ID del profesional', 'OK', { duration: 2500 });
      return;
    }

    const payload: Partial<Doctor> & { password?: string } = {
      first_name: this.doctorData.first_name,
      last_name: this.doctorData.last_name,
      specialty: this.doctorData.specialty,
      phone: this.doctorData.phone,
      email: this.doctorData.email,
      license_number: this.doctorData.license_number,
    };
    if (this.doctorData.password) {
      payload.password = this.doctorData.password;
    }

    this.doctorService.updateDoctor(id, payload).subscribe({
      next: (updated) => {

        // Actualizar storage con lo que vuelve del backend
        
        const merged: Doctor = {
          ...current,
          ...updated,
        };
        this.userStorage.setDoctor(merged);
        this.snack.open('Perfil guardado', 'OK', { duration: 2000 });
        this.closeDoctorPanel();
      },
      error: () => {
        this.snack.open('Error al guardar el perfil', 'OK', { duration: 3000 });
      },
    });
  }
}
