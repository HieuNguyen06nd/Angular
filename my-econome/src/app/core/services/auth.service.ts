// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

export interface User {
  id: number;
  email: string;
  phone: string;
  fullName: string;
  role: 'ADMIN' | 'CUSTOMER';
  status: 'ACTIVE' | 'PENDING';
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/shop-store/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  // Đăng ký tài khoản
  register(userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // Đăng nhập
  login(credentials: { emailOrPhone: string; password: string }) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.saveAuthData(response.token, response.user);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  // Lấy thông tin user hiện tại
  getCurrentUser() {
    return this.http.get<{
      status: number;
      message: string;
      data: User;
    }>(`${this.apiUrl}/user/me`).pipe(
      tap(response => {
        if (response.status === 200) {
          this.currentUserSubject.next(response.data);
        }
      })
    );
  }

  // Đăng xuất
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Kiểm tra đã đăng nhập
  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  // Kiểm tra role
  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get authToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private saveAuthData(token: string, user: User): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('currentUser');
    if (user && user !== 'undefined') {
      try {
        this.currentUserSubject.next(JSON.parse(user));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.currentUserSubject.next(null);
      }
    }
  }
  
}