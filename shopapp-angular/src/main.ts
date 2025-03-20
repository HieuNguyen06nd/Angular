import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { HomeComponent } from './app/home/home.component';
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

bootstrapApplication(HomeComponent, appConfig)
  .catch((err) => console.error(err));
