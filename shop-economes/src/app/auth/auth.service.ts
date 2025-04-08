import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';  




export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface LoginRequest {
  emailOrPhone: string;
  password: string;
}

export interface AuthResponse {
  status: number;
  message: string;
  data: {
    token: string;
  };
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/shop-store/api/auth';

  constructor(private http: HttpClient, private router: Router) {} // Thêm Router vào constructor

  // Đăng ký người dùng
  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  // Đăng nhập người dùng
  login(credentials: { emailOrPhone: string; password: string }): Observable<any> {
    return this.http.post<{ status: number; message: string; data: { token: string } }>(
      `${this.baseUrl}/login`, 
      credentials
    ).pipe(
      tap(response => {
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token); // Lưu token vào localStorage
          console.log('Đăng nhập thành công:', response);

          const userRole = this.getRoleFromToken(); // Lấy role từ token
          console.log('🎯 Role người dùng:', userRole);

          // Điều hướng theo role
          if (userRole === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']); // Điều hướng đến dashboard của Admin
          } else if (userRole === 'CUSTOMER') {
            this.router.navigate(['/user/dashboard']); // Điều hướng đến dashboard của User
          }
        }
      })
    );
  }

  isAuthenticated(): boolean {
    // Kiểm tra xem token có trong localStorage không
    return !!localStorage.getItem('token');
  }

  getRoleFromToken() {
    const token = localStorage.getItem('token');
    console.log("🔍 Token lấy từ localStorage:", token);

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log("✅ Token sau khi decode:", decodedToken); // Xem toàn bộ nội dung token

        if (decodedToken?.role) {
          console.log("🎯 Role lấy được:", decodedToken.role);
          return decodedToken.role;
        } else {
          console.warn("⚠️ Token không chứa thông tin role!");
          return null;
        }
      } catch (error) {
        console.error("❌ Lỗi khi decode token:", error);
        return null;
      }
    }
    return null;
  }
}