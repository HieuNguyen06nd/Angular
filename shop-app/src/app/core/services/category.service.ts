import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { Observable, map } from 'rxjs';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/shop-store/api/categories';

  constructor(private http: HttpClient) {}

  getRootCategories(): Observable<Category[]> {
    return this.http.get<any>(`${this.apiUrl}/root`).pipe(
      map(response => {
        const rawCategories: Category[] = response.data;
        return this.processCategories(rawCategories);
      })
    );
  }

  private processCategories(categories: Category[]): Category[] {
    return categories.map(category => ({
      ...category,
      children: category.children && category.children.length > 0
        ? this.processCategories(category.children)
        : []
    }));
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createCategory(category: any): Observable<Category> {
    return this.http.post<any>(this.apiUrl, category).pipe(
      map(response => response.data)
    );
  }

  updateCategory(id: number, category: any): Observable<Category> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, category).pipe(
      map(response => response.data)
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Thêm phương thức lấy đường dẫn
  getCategoryParents(categoryId: number): Observable<Category[]> {
    return this.http.get<{ data: Category[] }>(`${this.apiUrl}/${categoryId}/path`)
      .pipe(map(response => response.data));
  }

    // Trong CategoryService
  getCategoryWithChildren(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}?include=children`);
  }

}
