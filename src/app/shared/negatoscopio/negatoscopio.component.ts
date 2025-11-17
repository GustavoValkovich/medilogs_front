import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-negatoscopio',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './negatoscopio.component.html',
  styleUrls: ['./negatoscopio.component.scss'],
})

export class NegatoscopioComponent {
  private router = inject(Router);
  isOpen = false;

  get isAuthRoute(): boolean {
    const url = this.router.url || '';
    return url.startsWith('/auth/login') || url.startsWith('/auth/signup');
  }

  open(e: MouseEvent) {
    // Esto evita que la apertura propague clicks que cierren inmediatamente
    e.stopPropagation();
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}
