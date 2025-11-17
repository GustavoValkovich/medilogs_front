import { Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-notes-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './notes-dialog.component.html',
  styleUrls: ['./notes-dialog.component.scss'],
})

export class NotesDialogComponent {
  public data: { notes?: string; full_name?: string } | undefined;
  constructor(public dialogRef: MatDialogRef<NotesDialogComponent>, private injector: Injector) {
    try {
      this.data = this.injector.get(MAT_DIALOG_DATA) as any;
    } catch {
      this.data = undefined;
    }
  }

  close() {
    this.dialogRef.close();
  }
}
