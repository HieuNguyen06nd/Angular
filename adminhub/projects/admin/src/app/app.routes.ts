// projects/admin/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { 
        path: 'admin/dashboard', 
        loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { 
        path: 'admin/brand', 
        loadComponent: () => import('./admin/brands/brands.component').then(m => m.BrandsComponent)
      },
      { 
        path: 'admin/product', 
        loadComponent: () => import('./admin/products/products.component').then(m => m.ProductsComponent)
      },
      { 
        path: 'admin/category', 
        loadComponent: () => import('./admin/category/category.component').then(m => m.CategoryComponent)
      },
      { 
        path: 'admin/color', 
        loadComponent: () => import('./admin/color/color.component').then(m => m.ColorComponent)
      },
      { 
        path: 'admin/material', 
        loadComponent: () => import('./admin/material/material.component').then(m => m.MaterialComponent)
      },
      { 
        path: 'admin/order', 
        loadComponent: () => import('./admin/order/order.component').then(m => m.OrderComponent)
      },
      { 
        path: 'admin/user', 
        loadComponent: () => import('./admin/user/user.component').then(m => m.UserComponent)
      },
      { 
        path: 'admin/size', 
        loadComponent: () => import('./admin/size/size.component').then(m => m.SizeComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];