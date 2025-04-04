// projects/admin/src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ADMIN_ROUTES } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(ADMIN_ROUTES),
    provideHttpClient(withFetch()),
  ]
};