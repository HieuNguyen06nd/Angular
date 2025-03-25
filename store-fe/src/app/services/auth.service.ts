import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

// DTO cho đăng ký
export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

// DTO cho đăng nhập
export interface AuthRequest {
  emailOrPhone: string;
  password: string;
  otp?: string; // otp là tùy chọn
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/shop-store/api/auth';
  private tokenKey = 'authToken';
  private userKey = 'authUser';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userNameSubject = new BehaviorSubject<string | null>(this.getStoredUserName());

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userName$ = this.userNameSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Kiểm tra môi trường
  ) {}

  // Đăng ký tài khoản
  register(data: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, data);
  }

  // Đăng nhập
  login(data: AuthRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, data).pipe(
      tap((res) => {
        console.log('🟢 API login trả về:', res);
        if (res.token && res.user) {
          console.log('🟢 Đang lưu user:', res.user);
          this.saveAuthData(res.token, res.user);
        } else {
          console.error('🔴 Lỗi: API không trả về token hoặc user');
        }
      })
    );
  }
  
  // Kiểm tra token có tồn tại không
  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem(this.tokenKey);
    }
    return false;
  }

  // Lưu token và user vào localStorage
  private saveAuthData(token: string, user: any) {
    if (isPlatformBrowser(this.platformId)) {
      console.log('🟢 Lưu token:', token);
      console.log('🟢 Lưu user:', JSON.stringify(user));
  
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
  
      this.isLoggedInSubject.next(true);
      this.userNameSubject.next(user.fullName);
    }
  }
  
  // Lấy token từ localStorage
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // Lấy user từ localStorage
  private getStoredUserName(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData).fullName : null;
    }
    return null;
  }

  // Lấy thông tin người dùng từ API (nếu cần)
  fetchUserInfo() {
    const token = this.getToken();
    if (!token) return;
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.get<any>(`${this.baseUrl}/me`, { headers }).pipe(
      tap((res) => {
        console.log('🟢 Dữ liệu nhận từ API /me:', res); // Debug API response
        if (res && res.data) {
          this.saveAuthData(token, res.data);
        }
      }),
      catchError((err) => {
        console.error('Lỗi khi lấy thông tin user:', err);
        this.logout();
        return of(null);
      })
    ).subscribe();
  }
  

  // Đăng xuất
  logout() {
    console.log('🔴 Đăng xuất...');
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey); // 🔥 Xóa userKey
    }
    this.isLoggedInSubject.next(false);
    this.userNameSubject.next(null);
    
    console.log('🟢 Trạng thái isLoggedIn:', this.isLoggedInSubject.getValue());
    console.log('🟢 Tên user:', this.userNameSubject.getValue());
  }
  

  saveToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token);
      this.isLoggedInSubject.next(true);
      this.fetchUserInfo();
    }
    console.log('🟢 Đăng nhập thành công, isLoggedIn:', this.isLoggedInSubject.getValue());
  }
  
  
}
