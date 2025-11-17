import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PatientService } from '../../../../core/services/patient.service';
import { ConsultationService } from '../../../../core/services/consultation.service';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
})

export class PatientFormComponent {
  form = this.fb.group({
    id: [],
    full_name: ['', Validators.required],
    document: [''],
    birth_date: [''],
    notes: [''],
    gender: [''],
    insurance: [''],
    email: [''],
    city: [''],
    doctor_id: [],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private router: Router,
    private patientService: PatientService,
    private consultationService: ConsultationService
  ) {}
  canDelete = false;
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const nid = Number(id);
      if (!isNaN(nid)) {
        this.patientService.get(nid).subscribe({
          next: (p) => {

            if (p && p.birth_date) {
              (p as any).birth_date = this.toInputDate(p.birth_date);
            }
            this.form.patchValue(p);

            try {
              this.consultationService.list(nid).subscribe({
                next: (rows) => {
                  try {
                    let arr: any[] = [];
                    if (Array.isArray(rows)) arr = rows as any[];
                    else if (rows && Array.isArray((rows as any).data)) arr = (rows as any).data;

                    const filtered = (arr || []).filter((r: any) => Number(r.patient_id) === Number(nid));
                    this.canDelete = (filtered.length === 0);
                  } catch {
                    this.canDelete = false;
                  }
                },
                error: () => { this.canDelete = false; }
              });
            } catch {
              this.canDelete = false;
            }
          },
          error: () => this.snack.open('No se pudo cargar el paciente', 'OK', { duration: 3000 })
        });
      }
    } else {

      try {
        const raw = localStorage.getItem('medilogs_user');
        if (raw) {
          const user = JSON.parse(raw) as { id?: number };
          if (user?.id != null) this.form.patchValue({ doctor_id: user.id });
        }
      } catch {
        // ignore
      }
    }
  }

  deletePatient() {
    const id = this.form.value.id ?? Number(this.route.snapshot.paramMap.get('id'));
    const nid = Number(id);
    if (!nid || isNaN(nid)) return;
    if (!this.canDelete) {
      this.snack.open('No se puede eliminar: el paciente tiene consultas asociadas', 'OK', { duration: 3000 });
      return;
    }
    const ok = confirm('ATENCIÓN: Esta acción eliminará permanentemente al paciente. ¿Desea continuar?');
    if (!ok) return;
    this.patientService.softDelete(nid).subscribe({
      next: () => {
        this.snack.open('Paciente eliminado', 'OK', { duration: 2000 });
        this.router.navigate(['/patients']);
      },
      error: () => this.snack.open('Error al eliminar paciente', 'OK', { duration: 3000 })
    });
  }

  onDeleteClick(event: MouseEvent) {

    if (!this.form.value.id) return;

    if (!this.canDelete) {
      alert('Paciente con historias clinicas');
      event.stopPropagation();
      return;
    }
    this.deletePatient();
  }

  save() {
    if (this.form.invalid) {
      this.snack.open('Complete el nombre del paciente', 'OK', { duration: 2000 });
      return;
    }
    const value = { ...this.form.value };
    const id = value.id;

    if (value.birth_date) value.birth_date = this.toInputDate(value.birth_date);
    if (id) {

      const patientToUpdate = { ...(value as any), id } as any;
      this.patientService.update(id, patientToUpdate).subscribe({
        next: () => { this.snack.open('Paciente actualizado', 'OK', { duration: 2000 }); this.router.navigate(['/patients']); },
        error: () => this.snack.open('Error al actualizar paciente', 'OK', { duration: 3000 })
      });
    } else {

  const payload = { ...(value as any) };
      delete payload.id;
      this.patientService.create(payload).subscribe({
        next: () => { this.snack.open('Paciente creado', 'OK', { duration: 2000 }); this.router.navigate(['/patients']); },
        error: () => this.snack.open('Error al crear paciente', 'OK', { duration: 3000 })
      });
    }
  }

  private toInputDate(v: any): string | null {
    if (!v) return null;
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;

    const d = new Date(v);
    if (isNaN(d.getTime())) {

    const parts = String(v).split('/');
      if (parts.length === 3) {
        const [dd, mm, yyyy] = parts;
        const candidate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
        if (!isNaN(candidate.getTime())) return this.formatDate(candidate);
      }
      return null;
    }
    return this.formatDate(d);
  }

  private formatDate(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
