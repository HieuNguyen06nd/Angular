import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TokenStorageService } from './token-storage.service';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  roles: string[];
}

export interface AuthResponse {
  status: number;
  message: string;
  data: {
    token?: string;
    refreshToken?: string;
    user?: User;
    message?: string;
  };
}

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  otp?: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) {
    this.initializeCurrentUser();
  }

  private initializeCurrentUser(): void {
    // Lấy thông tin người dùng từ localStorage
    const user = this.tokenStorage.getUser();
    this.currentUserSubject.next(user);
  }



  register(userData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      catchError(error => throwError(() => this.getErrorMessage(error)))
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenStorage.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      tap(response => {
        if (response.status === 200 && response.data.token) {
          this.tokenStorage.saveTokens({
            accessToken: response.data.token,
            refreshToken: response.data.refreshToken || ''
          });
        }
      }),
      catchError(error => {
        this.handleAuthError();
        return throwError(() => this.getErrorMessage(error));
      })
    );
  }

  logout(): Observable<AuthResponse> {
    const userEmail = this.currentUserValue?.email;
    return this.http.post<AuthResponse>(`${this.apiUrl}/logout`, { email: userEmail }).pipe(
      tap(() => this.handleAuthError()),
      catchError(error => throwError(() => this.getErrorMessage(error)))
    );
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue && !!this.tokenStorage.getAccessToken();
  }

  hasRole(requiredRole: string): boolean {
    const user = this.currentUserValue;
    return user?.roles?.includes(requiredRole) ?? false;
  }

  hasAnyRole(requiredRoles: string[]): boolean {
    return requiredRoles.some(role => this.hasRole(role));
  }

  private handleAuthSuccess(response: AuthResponse): void {
    if (response.status === 200 && response.data?.token) {
      this.tokenStorage.saveTokens({
        accessToken: response.data.token,
        refreshToken: response.data.refreshToken || ''
      });

      if (response.data.user) {
        this.tokenStorage.saveUser(response.data.user);
        this.currentUserSubject.next(response.data.user);
      }
    }
  }

  private handleAuthError(): void {
    this.tokenStorage.clear();
    this.currentUserSubject.next(null);
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'Đã xảy ra lỗi không xác định';
  }
}
