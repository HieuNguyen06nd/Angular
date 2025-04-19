// src/app/services/size.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Size } from '../models/size.model';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.models';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
  private apiUrl = `${environment.apiUrl}/api/sizes`;

  constructor(private http: HttpClient) { }

  getAllSizes(): Observable<Size[]> {
    return this.http.get<ApiResponse<Size[]>>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  createSize(size: Size): Observable<Size> {
    return this.http.post<ApiResponse<Size>>(this.apiUrl, size).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  updateSize(id: number, size: Size): Observable<Size> {
    return this.http.put<ApiResponse<Size>>(`${this.apiUrl}/${id}`, size).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  deleteSize(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Lỗi không xác định';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      errorMessage = `Mã lỗi ${error.status}: ${error.error?.message || error.message}`;
    }
    console.error(error);
    return throwError(() => new Error(errorMessage));
  }
}