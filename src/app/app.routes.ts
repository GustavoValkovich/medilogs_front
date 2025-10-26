import { Routes } from '@angular/router';
import { User } from './user/user';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'user', component: User}, 
    { path: 'user/:id', component: User}, 
    { path: 'home', component: HomeComponent }];
