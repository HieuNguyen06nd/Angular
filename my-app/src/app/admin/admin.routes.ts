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
        loadComponent: () =>import('./products/products.component').then(m => m.ProductComponent)
      },
      { 
        path: 'categories',
        loadComponent: () =>import('./category/category.component').then(m => m.CategoryComponent)
      },
      { 
        path: 'brands',
        loadComponent: () =>import('./brand/brand.component').then(m => m.BrandComponent)
      },
      { 
        path: 'orders',
        loadComponent: () =>import('./orders/orders.component').then(m => m.OrdersComponent)
      }
    ]
  }
];