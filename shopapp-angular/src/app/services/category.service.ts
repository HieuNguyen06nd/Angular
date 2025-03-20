import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/shop-store/api/categories/root';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<{ success: boolean; message: string; data: any[] }>(this.apiUrl).pipe(
      map((response: { success: boolean; message: string; data: any[] }) => response.data) // ✅ Định rõ kiểu dữ liệu
    );
  }
}
