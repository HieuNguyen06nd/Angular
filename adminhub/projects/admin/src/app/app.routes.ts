// projects/admin/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { 
        path: 'brands', 
        loadComponent: () => import('./admin/brands/brands.component').then(m => m.BrandsComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];