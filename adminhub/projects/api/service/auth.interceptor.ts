import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Thêm headers nếu cần
  const authReq = req.clone({
    setHeaders: {
      'Accept': 'application/json', // Yêu cầu server trả về JSON
      'Content-Type': 'application/json'
    }
  });

  return next(authReq).pipe(
    catchError((error) => {
      // Xử lý lỗi cụ thể
      if (error.status === 200 && error.error instanceof ProgressEvent) {
        console.error('Server returned HTML instead of JSON');
      }
      throw error;
    })
  );
};