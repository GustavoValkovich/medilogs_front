import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgSwitch } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User {

  id: string | null = null;

  constructor(private router: ActivatedRoute) {
    this.router.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    console.log('UserComponent initialized');
  }

  ngOnDestroy() {
    console.log('UserComponent destroyed');
  }


  name = 'Gustavo';

  user = '';
  
  password = '';

  isVisible = false;

  message = '';

  menus = ['Home', 'About', 'Contact', 'Services'];

  onClick() {
    this.isVisible = this.user === this.password ? true : false;
  }

}
