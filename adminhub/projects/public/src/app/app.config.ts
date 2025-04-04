import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideZoneChangeDetection } from '@angular/core';

import { routes } from './app.routes';
import { authInterceptor } from '../../../api/service/auth.interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    // Routing nên đứng đầu
    provideRouter(routes),
    
    // HTTP Client config
    provideHttpClient(
      withFetch(), // Chỉ cần nếu dùng SSR với fetch
      withInterceptors([authInterceptor])
    ),
    
    // SSR Hydration
    provideClientHydration(withEventReplay()),
    
    // Zone.js optimization
    provideZoneChangeDetection({ 
      eventCoalescing: true,
      // runCoalescing: true // Có thể thêm nếu cần
    })
  ]
};