import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Chuyển hướng trang chính đến /home
  { path: 'home', component: HomeComponent }, // Route đến HomeComponent
];
