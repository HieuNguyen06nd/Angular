import { Routes } from '@angular/router';
import { HomeComponent } from './features/public/home/home.component';
import { AboutComponent } from './features/public/about/about.component';
import { ContactComponent } from './features/public/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Trang chủ' },
  { path: 'about', component: AboutComponent, title: 'Giới thiệu' },
  { path: 'contact', component: ContactComponent, title: 'Liên hệ' },
  { path: '**', redirectTo: '' } // Redirect 404 về trang chủ
];