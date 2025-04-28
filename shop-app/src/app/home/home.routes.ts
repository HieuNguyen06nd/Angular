import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { PageCategoryComponent } from './page-category/page-category.component';
import { PageOfferComponent } from './page-offer/page-offer.component';
import { PageCheckoutComponent } from './page-checkout/page-checkout.component';
import { PageCartComponent } from './page-cart/page-cart.component';
import { PageAccountComponent } from './page-account/page-account.component';


export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: HomeLayoutComponent },
      { path: 'product/:id', component: ProductDetailComponent },
      { path: 'product/category/:id', component: PageCategoryComponent },
      { path: 'product/offer/:id', component: PageOfferComponent},
     // ROUTE CHO GIỎ HÀNG
     { path: 'cart', component: PageCartComponent },
     // ROUTE CHO THANH TOÁN
     { path: 'checkout', component: PageCheckoutComponent },
     { path: 'account/:id', component: PageAccountComponent },
     // nếu cần: redirect không tìm thấy
     { path: '**', redirectTo: '' }
    ]
  }
];
