import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ResponseData<T> {
  status: number;
  message: string;
  data: T;
}

import { Category } from '../model/category.model';

export interface CategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  parentId?: number | null;
  status?: string;
  active?: boolean;
  
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // Địa chỉ backend (có thể dùng proxy khi chạy Angular)
  private baseUrl =  environment.apiUrl +'/api/categories';

  constructor(private http: HttpClient) {}

  // Lấy danh sách danh mục gốc
  getRootCategories(): Observable<ResponseData<Category[]>> {
    return this.http.get<ResponseData<Category[]>>(`${this.baseUrl}/root`);
  }

  // Tạo danh mục mới
  createCategory(request: CategoryRequest): Observable<ResponseData<Category>> {
    return this.http.post<ResponseData<Category>>(this.baseUrl, request);
  }

  // Lấy danh mục theo ID
  getCategory(id: number): Observable<ResponseData<Category>> {
    return this.http.get<ResponseData<Category>>(`${this.baseUrl}/${id}`);
  }

  // Lấy danh mục con theo parentId
  getSubCategories(parentId: number): Observable<ResponseData<Category[]>> {
    return this.http.get<ResponseData<Category[]>>(`${this.baseUrl}/sub?parentId=${parentId}`);
  }

  // Cập nhật danh mục
  updateCategory(id: number, request: CategoryRequest): Observable<ResponseData<Category>> {
    return this.http.put<ResponseData<Category>>(`${this.baseUrl}/${id}`, request);
  }

  // Xóa danh mục
  deleteCategory(id: number): Observable<ResponseData<void>> {
    return this.http.delete<ResponseData<void>>(`${this.baseUrl}/${id}`);
  }
}
