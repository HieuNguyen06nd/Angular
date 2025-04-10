// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ProductSingleComponent } from './pages/product-single//product-single.component';
import { RoleGuard } from './core/guards/role.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { 
    path: 'home',
    component: HomeComponent
  },
  { 
    path: 'page-single/:id',
    component: ProductSingleComponent
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  

  // Admin route (giữ nguyên)
  { 
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [ RoleGuard],
    data: { roles: ['ADMIN'] }
  },

  { path: '**', redirectTo: 'home' }
];