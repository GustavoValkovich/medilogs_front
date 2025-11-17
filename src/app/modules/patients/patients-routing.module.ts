import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientsListComponent } from './components/patients-list/patients-list.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { ConsultationFormComponent } from './components/consultation-form/consultation-form.component';

const routes: Routes = [
  { path: '', component: PatientsListComponent },
  { path: 'new', component: PatientFormComponent },
  { path: ':id', component: PatientFormComponent },
  { path: ':id/consultations', component: ConsultationFormComponent },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class PatientsRoutingModule {}
