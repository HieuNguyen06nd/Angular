import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface đại diện cho dữ liệu đăng ký
export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/shop-store/api/auth';

  constructor(private http: HttpClient) {}

  // Hàm gọi API Đăng ký
  register(data: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, data);
  }
}
