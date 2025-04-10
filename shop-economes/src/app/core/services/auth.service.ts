import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs/operators';
import { RegisterRequest, LoginRequest, AuthResponse } from '../models/auth.models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/shop-store/api/auth';
  public isLoggedIn$ = new BehaviorSubject<boolean>(false); // <-- Khởi tạo tạm thời

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) {
    this.isLoggedIn$.next(this.checkLoginStatus()); // <-- Khởi tạo trạng thái sau khi storageService đã có
  }

  private checkLoginStatus(): boolean {
    return !!this.storageService.getItem('token');
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/login`,
      credentials
    ).pipe(
      tap(response => {
        if (response.status === 200) {
          this.handleLoginSuccess(response.data.token);
        }
      })
    );
  }

  private handleLoginSuccess(token: string): void {
    this.storageService.setItem('token', token);
    const user = this.decodeToken(token);
    if (user) {
      this.storageService.setItem('user', JSON.stringify(user));
    }
    this.isLoggedIn$.next(true); // cập nhật trạng thái

    const returnUrl = this.getReturnUrl();
    if (this.isAdmin()) {
      this.router.navigateByUrl(returnUrl || '/admin/dashboard');
    } else {
      this.router.navigateByUrl(returnUrl || '/home');
    }
  }

  logout(): void {
    this.storageService.removeItem('token');
    this.storageService.removeItem('user');
    this.isLoggedIn$.next(false); // cập nhật lại trạng thái sau khi logout
    this.router.navigate(['/home']);
  }

  isAuthenticated(): boolean {
    return !!this.storageService.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.getRoleFromToken() === 'ADMIN';
  }

  getUserProfile(): Observable<any> {
    const token = this.storageService.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get('http://localhost:8080/shop-store/api/user/me', { headers });
  }

  private getReturnUrl(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('returnUrl') || '';
  }

  public getRoleFromToken(): string | null {
    const token = this.storageService.getItem('token');
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role || decoded.roles?.[0] || null;
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Decode error:', error);
      return null;
    }
  }
}
