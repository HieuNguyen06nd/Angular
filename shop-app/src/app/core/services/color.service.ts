import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Color } from '../models/color.model';
import { ApiResponse } from '../models/api-response.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private apiUrl = `${environment.apiUrl}/api/colors`;

  constructor(private http: HttpClient) { }

  // Lấy tất cả màu sắc
  getAllColors(): Observable<Color[]> {
    return this.http.get<ApiResponse<Color[]>>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Lấy màu theo ID
  getColorById(id: number): Observable<Color> {
    return this.http.get<ApiResponse<Color>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Tạo màu mới
  createColor(color: Color): Observable<Color> {
    return this.http.post<ApiResponse<Color>>(this.apiUrl, color).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Cập nhật màu
  updateColor(id: number, color: Color): Observable<Color> {
    return this.http.put<ApiResponse<Color>>(`${this.apiUrl}/${id}`, color).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Xóa màu
  deleteColor(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(response => undefined),
      catchError(this.handleError)
    );
  }

  // Xử lý lỗi
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Lỗi không xác định';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Lỗi: ${error.error.message}`;
    } else if (error.status) {
      errorMessage = `Mã lỗi ${error.status}: ${error.error?.message || error.message}`;
    }
    console.error(error);
    return throwError(() => new Error(errorMessage));
  }
}