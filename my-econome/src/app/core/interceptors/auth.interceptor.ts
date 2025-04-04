import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.authToken;
  
    // Danh sách URL không cần token
    const excludedUrls = ['/auth/login', '/auth/register'];
    
    if (token && !excludedUrls.some(url => req.url.includes(url))) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(authReq);
    }
  
    return next(req);
  };