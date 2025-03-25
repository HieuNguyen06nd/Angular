import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { 
        path: 'products',
        loadComponent: () =>import('./products/products.component').then(m => m.ProductsComponent)
      },
      { 
        path: 'categories',
        loadComponent: () =>import('./category/category.component').then(m => m.CategoryComponent)
      }
    ]
  }
];