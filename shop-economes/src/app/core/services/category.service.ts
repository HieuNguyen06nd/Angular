// src/app/services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/shop-store/api/categories/root';

  constructor(private http: HttpClient) { }

  // Hàm lấy danh mục gốc và xử lý đệ quy nếu cần
  getRootCategories(): Observable<Category[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        const rawCategories: Category[] = response.data;
        return this.processCategories(rawCategories);
      })
    );
  }

  // Hàm xử lý đệ quy để gắn logic bổ sung nếu cần
  private processCategories(categories: Category[]): Category[] {
    return categories.map(category => ({
      ...category,
      children: category.children && category.children.length > 0
        ? this.processCategories(category.children)
        : []
    }));
  }
}
