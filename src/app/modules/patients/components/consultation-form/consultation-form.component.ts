import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { NotesDialogComponent } from './notes-dialog.component';
import { ConsultationDetailDialogComponent } from './consultation-detail-dialog.component';
import { PatientService } from '../../../../core/services/patient.service';
import { ConsultationService } from '../../../../core/services/consultation.service';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './consultation-form.component.html',
  styleUrls: ['./consultation-form.component.scss'],
})

export class ConsultationFormComponent {
  patientName?: string;
  form = this.fb.group({
    id: [],
    motivo: ['', Validators.required],
    patient_id: [],
  });

  displayedColumnsHist = ['created_at', 'motivo', 'actions'];
  consultasData: any = { data: [] };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    public router: Router,
    private patientService: PatientService,
    private dialog: MatDialog,
    private consultationService: ConsultationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const nid = Number(id);
      if (!isNaN(nid)) {
        this.patientService.get(nid).subscribe({
          next: (p) => {
            this.patientName = p?.full_name;
            if (p?.notes) {
              this.dialog.open(NotesDialogComponent, { data: { notes: p.notes }, width: '450px', maxHeight: '80vh' });
            }
            this.consultationService.list(nid).subscribe({
              next: (rows) => {
                try {
                  const filtered = (rows || []).filter((r: any) => Number(r.patient_id) === Number(nid));
                  this.consultasData = { data: filtered };
                } catch {
                  this.consultasData = { data: rows || [] };
                }
              },
              error: () => { this.consultasData = { data: [] }; }
            });
          },
          error: () => {}
        });
      }
    }
  }

  submit() {
    if (this.form.invalid) {
      this.snack.open('Complete el motivo de la consulta', 'OK', { duration: 2000 });
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    const patient_id = idParam ? Number(idParam) : undefined;
    if (!patient_id || isNaN(patient_id)) {
      this.snack.open('Paciente inválido', 'OK', { duration: 2000 });
      return;
    }

  const payload: any = { patient_id, medical_record: this.form.value.motivo };
    this.consultationService.create(payload).subscribe({
        next: (c) => {
          try {
            const created = { ...(c as any), medical_record: (c as any).medical_record ?? (c as any).reason ?? (c as any).motivo };
            const createdPatientId = Number((c as any).patient_id ?? (c as any).patient?.id);
            if (createdPatientId === patient_id) {
              if (!this.consultasData) this.consultasData = { data: [] };
              if (!this.consultasData.data) this.consultasData.data = [];
              this.consultasData.data = [created, ...this.consultasData.data];
            }
          } catch {}
          this.snack.open('Consulta guardada', 'OK', { duration: 2000 });
          this.form.reset();
        },
      error: (e) => {
        const msg = e?.error?.message || 'Error al guardar la consulta';
        this.snack.open(msg, 'OK', { duration: 3000 });
      }
    });
  }

  truncateText(v: any, n = 30): string {
    if (v == null || v === '') return '-';
    try {
      const s = String(v);
      return s.length > n ? s.slice(0, n) + '...' : s;
    } catch {
      return '-';
    }
  }

  deleteConsultation(row: any) {
    const id = Number(row?.id);
    if (!id || isNaN(id)) return;
    const ok = confirm('¿Eliminar esta consulta?');
    if (!ok) return;
    const deletedAt = new Date().toISOString();
    this.consultationService.softDelete(id, deletedAt).subscribe({
      next: () => {
        try {
          if (this.consultasData?.data) {
            this.consultasData.data = this.consultasData.data.filter((r: any) => Number(r.id) !== id);
          }
        } catch {}
        this.snack.open('Consulta eliminada', 'OK', { duration: 2000 });
      },
      error: (e) => {
        const msg = e?.error?.message || 'Error al eliminar la consulta';
        this.snack.open(msg, 'OK', { duration: 3000 });
      }
    });
  }

  openConsultationDetail(row: any) {
    if (!row) return;
    const motivo = row.medical_record ?? row.reason ?? row.motivo ?? '';
    const created = row.created_at ?? row.createdAt ?? row.date;
    this.dialog.open(ConsultationDetailDialogComponent, { data: { created_at: created, motivo }, width: '450px', maxHeight: '80vh' });
  }
}
