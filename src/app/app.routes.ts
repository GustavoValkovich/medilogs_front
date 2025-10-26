import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'patients' },

      // Patients (ya existentes)
      {
        path: 'patients',
        loadComponent: () =>
          import('./features/patients/pages/patient-list.component')
            .then(m => m.PatientListComponent),
      },
      {
        path: 'patients/new',
        loadComponent: () =>
          import('./features/patients/pages/patient-form.component')
            .then(m => m.PatientFormComponent),
      },
      {
        path: 'patients/:id',
        loadComponent: () =>
          import('./features/patients/pages/patient-form.component')
            .then(m => m.PatientFormComponent),
      },

      // Doctors (NUEVO)
      {
        path: 'doctors',
        loadComponent: () =>
          import('./features/doctors/pages/doctor-list.component')
            .then(m => m.DoctorListComponent),
      },
      {
        path: 'doctors/new',
        loadComponent: () =>
          import('./features/doctors/pages/doctor-form.component')
            .then(m => m.DoctorFormComponent),
      },
      {
        path: 'doctors/:id',
        loadComponent: () =>
          import('./features/doctors/pages/doctor-form.component')
            .then(m => m.DoctorFormComponent),
      },

      // Consultations (NUEVO)
      {
        path: 'consultations',
        loadComponent: () =>
          import('./features/consultations/pages/consultation-list.component')
            .then(m => m.ConsultationListComponent),
      },
      {
        path: 'consultations/new',
        loadComponent: () =>
          import('./features/consultations/pages/consultation-form.component')
            .then(m => m.ConsultationFormComponent),
      },
      {
        path: 'consultations/:id',
        loadComponent: () =>
          import('./features/consultations/pages/consultation-form.component')
            .then(m => m.ConsultationFormComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];