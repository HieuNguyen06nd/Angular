import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../model/user.model';
import { isPlatformBrowser } from '@angular/common';

export interface ApiResponse<T> {
  status: number;
  message?: string;
  data: T;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/user`;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  getCurrentUser(): Observable<User | null> {
    // Nếu không chạy trên trình duyệt (SSR) thì không có token, trả về null
    if (!isPlatformBrowser(this.platformId)) {
      return of(null);
    }
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Nếu không có token, trả về lỗi
      return throwError(() => new Error('Không tìm thấy token xác thực'));
    }
    
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/me`, { headers, responseType: 'json' }).pipe(
      tap(response => console.debug('API Response:', response)), // Debug log
      map(response => this.normalizeUser(response.data)),
      catchError(this.handleError)
    );
  }

  // Hàm trả về HttpHeaders nếu chạy trên trình duyệt, ngược lại trả về rỗng
  getAuthHeaders(): HttpHeaders {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
    }
    return new HttpHeaders();
  }

  private normalizeUser(apiData: any): User {
    if (!apiData?.id) {
      throw new Error('Dữ liệu người dùng không hợp lệ');
    }
    return {
      id: apiData.id,
      email: apiData.email || '',
      phone: apiData.phone || '',
      fullName: apiData.fullName || apiData.phone || 'Khách',
      emailVerified: apiData.emailverified || apiData.emailVerified || false,
      role: apiData.role || 'CUSTOMER',
      status: apiData.status || 'PENDING',
      createdAt: apiData.createdAt || new Date().toISOString(),
      updatedAt: apiData.updatedAt || new Date().toISOString()
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Lỗi không xác định';
    
    if (error.status === 0) {
      errorMessage = 'Lỗi kết nối đến server';
    } else if (error.status === 401) {
      errorMessage = 'Phiên đăng nhập hết hạn';
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('authToken');
      }
    } else if (error.status >= 400 && error.status < 500) {
      errorMessage = `Lỗi client: ${error.error?.message || error.message}`;
    } else {
      errorMessage = `Lỗi server: ${error.status} - ${error.message}`;
    }

    console.error('[UserService] Lỗi:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
