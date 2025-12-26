import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, ValidationErrors, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from '../../core/services/auth.service';

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirm_password')?.value;

  if (!password || !confirm) return null;
  return password === confirm ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})

export class SignupComponent {
  loading = false;
  hidePassword = true;
  error?: string | null;

  
  specialties: string[] = [
   'Clínica médica',
    'Pediatría',
    'Cardiología',
    'Ginecología',
    'Traumatología',
    'Dermatología',
    'Otorrinolaringología',
    ];

  form = this.fb.group(
  {
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    specialty: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    license_number: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm_password: ['', [Validators.required]],
  },
  { validators: passwordsMatchValidator }
);


  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar,
  ) {}

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;

    const value = this.form.value as {
      first_name: string;
      last_name: string;
      email: string;
      specialty?: string;
      phone?: string;
      license_number: string;
      password: string;
    };

    this.auth.signup(value).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open('Cuenta creada, ahora podés iniciar sesión', 'OK', { duration: 2500 });
        this.router.navigate(['/auth/login']);
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message || 'Error al crear la cuenta';
      },
    });
  }
}
