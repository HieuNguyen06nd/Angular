// src/app/core/services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  parent?: Category;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

interface ResponseData<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  // Tạo mới danh mục
  createCategory(category: Omit<Category, 'id'>) {
    return this.http.post<ResponseData<Category>>(this.apiUrl, category);
  }

  // Lấy danh mục theo ID
  getCategory(id: number) {
    return this.http.get<ResponseData<Category>>(`${this.apiUrl}/${id}`);
  }

  // Lấy danh mục gốc
  getRootCategories() {
    return this.http.get<ResponseData<Category[]>>(`${this.apiUrl}/root`);
  }

  // Lấy danh mục con
  getSubCategories(parentId: number) {
    return this.http.get<ResponseData<Category[]>>(`${this.apiUrl}/sub?parentId=${parentId}`);
  }

  // Cập nhật danh mục
  updateCategory(id: number, category: Partial<Category>) {
    return this.http.put<ResponseData<Category>>(`${this.apiUrl}/${id}`, category);
  }

  // Xóa danh mục
  deleteCategory(id: number) {
    return this.http.delete<ResponseData<void>>(`${this.apiUrl}/${id}`);
  }
}