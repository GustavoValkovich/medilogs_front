import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-user',
  imports: [FormsModule, NgIf],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User {

  ngOnInit() {
    console.log('User component initialized');
  }

  ngOnDestroy() {
    console.log('User component destroyed');
  }

  name = 'Gustavo J Valkovich';
  isVisible = true;

  message = '';

  onClick() {
    this.message = 'Button clicked!';
    console.log(this.message);
  }
}
