import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { HomeLayoutComponent } from './home-layout/home-layout.component';


export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: HomeLayoutComponent },
      { path: 'product/:id', component: ProductDetailComponent },
    ]
  }
];
