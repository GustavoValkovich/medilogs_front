import { Component, Injector, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { PatientService } from '../../../../../core/services/patient.service';
import { Patient } from '../../../../../core/models/patient.model';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-consultation-detail-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './consultation-detail-dialog.component.html',
  styleUrls: ['./consultation-detail-dialog.component.scss'],
})

export class ConsultationDetailDialogComponent {
  public data: any | undefined;
  public patientName?: string | undefined;
  private patientService = inject(PatientService);
  constructor(public dialogRef: MatDialogRef<ConsultationDetailDialogComponent>, private injector: Injector) {
    try {
      this.data = this.injector.get(MAT_DIALOG_DATA) as any;
    } catch {
      this.data = undefined;
    }
    try {
      const pid = this.data && (this.data.patient_id ?? (this.data.patient && this.data.patient.id));
      if (pid != null) {
        this.patientService.get(Number(pid)).subscribe({ next: (p: Patient) => { if (p?.full_name) this.patientName = p.full_name; }, error: () => { /* ignore */ } });
      }
    } catch (e) {
    
    }
  }

  getConsultationText(): string | null {
    if (!this.data) return null;
    const candidates = ['motivo', 'reason', 'notes', 'description', 'observations', 'record', 'summary', 'nota', 'note'];
    for (const k of candidates) {
      const v = this.data[k];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
    try {
      // scan for any string field that looks relevant
      for (const key of Object.keys(this.data)) {
        const val = (this.data as any)[key];
        if (typeof val === 'string' && val.trim() && key.toLowerCase().length > 3) {
          // return the first non-trivial string found
          return val.trim();
        }
      }
    } catch {}
    console.debug('[consultation-detail] no text found in data', this.data);
    return null;
  }

  close() { this.dialogRef.close(); }
}
