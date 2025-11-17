import { Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})

export class ConfirmDialogComponent {
  public data: { title?: string; message?: string } | undefined;
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, private injector: Injector) {
    try {
      this.data = this.injector.get(MAT_DIALOG_DATA) as any;
    } catch {
      this.data = undefined;
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
