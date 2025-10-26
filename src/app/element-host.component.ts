import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import './app.css';

@Component({
  standalone: true,
  selector: 'medilog-host',
  imports: [RouterOutlet],
  template: `<router-outlet />`, // sólo enruta; LayoutComponent ya está en routes
})
export class ElementHostComponent {}