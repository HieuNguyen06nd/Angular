import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🛠 Interceptor đang xử lý request:', req);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('🚨 Lỗi từ API:', error);

        // Nếu API trả về lỗi HTTP (400, 401, 403, 500, ...)
        if (error.status >= 400) {
          this.toastr.error(error.error?.message || 'Có lỗi xảy ra', `Lỗi ${error.status}`);
        }

        return throwError(() => error);
      })
    );
  }
}
