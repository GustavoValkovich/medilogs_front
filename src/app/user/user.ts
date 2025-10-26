import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
<<<<<<< HEAD
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [FormsModule, NgIf],
=======
import { NgFor, NgIf, NgSwitch } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [FormsModule, NgIf, NgFor],
>>>>>>> fa56c24e14c506e7191230e2ba78a829e12a72c2
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

<<<<<<< HEAD
  name = 'Gustavo J Valkovich';

  isVisible = true;
=======

  name = 'Gustavo';

  user = '';
  
  password = '';

  isVisible = false;
>>>>>>> fa56c24e14c506e7191230e2ba78a829e12a72c2

  message = '';

  menus = ['Home', 'About', 'Contact', 'Services'];

  onClick() {
<<<<<<< HEAD
    this.isVisible = !this.isVisible;
=======
    this.isVisible = this.user === this.password ? true : false;
>>>>>>> fa56c24e14c506e7191230e2ba78a829e12a72c2
  }

}
