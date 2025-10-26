import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import '../app.css';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [RouterLink, RouterOutlet],
  template: `
    <nav class="card" style="margin:12px;">
      <div class="toolbar">
        <div><strong>Medilog</strong></div>
        <div class="row" style="gap:8px;">
          <a routerLink="/patients" class="button">Patients</a>
          <a routerLink="/doctors" class="button">Doctors</a>
          <a routerLink="/consultations" class="button">Consultations</a>
        </div>
      </div>
    </nav>
    <main class="container">
      <router-outlet />
    </main>
  `,
})
export class LayoutComponent {}