import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../shared/material.module';

import { PatientsListComponent } from './components/patients-list/patients-list.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { ConsultationFormComponent } from './components/consultations/consultation-form/consultation-form.component';
import { NotesDialogComponent } from './components/consultations/notes-dialog/notes-dialog.component';
import { ConsultationDetailDialogComponent } from './components/consultations/consultation-detail-dialog/consultation-detail-dialog.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { PieChartComponent } from '../../shared/pie-chart/pie-chart.component';
import { PatientsRoutingModule } from './patients-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    PatientsRoutingModule,
    PatientsListComponent,
    PatientFormComponent,
    ConsultationFormComponent,
    NotesDialogComponent,
    ConsultationDetailDialogComponent,
    AnalysisComponent,
    PieChartComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PatientsModule {}
