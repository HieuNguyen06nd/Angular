import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { BrandComponent } from './brand/brand.component';
import { SizeComponent } from './size/size.component';
import { OrderComponent } from './order/order.component';
import { ColorComponent } from './color/color.component';
import { CategoryComponent } from './category/category.component';
import { MaterialComponent } from './material/material.component';
import { ProductListComponent } from './product-list/product-list.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'brand', component:BrandComponent },
      { path: 'size', component: SizeComponent },
      { path: 'order', component: OrderComponent },
      { path: 'color', component: ColorComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'user', component: UsersComponent },
      { path: 'material', component: MaterialComponent },
      { path: 'products', component: ProductListComponent}
    ]
  }
];
