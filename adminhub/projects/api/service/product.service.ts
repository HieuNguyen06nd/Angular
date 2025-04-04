import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Product } from '../model/product.model';

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) {}

  // Lấy danh sách sản phẩm
  getAllProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(this.baseUrl)
      .pipe(
        map(response => response.data || [])
      );
  }
  
  // Lấy chi tiết sản phẩm theo id
  getProductById(id: number): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  // Tạo sản phẩm mới (dùng FormData để hỗ trợ multipart/form-data)
  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(this.baseUrl, formData)
      .pipe(
        map(response => response.data)
      );
  }

  // Cập nhật sản phẩm
  updateProduct(id: number, formData: FormData): Observable<Product> {
    return this.http.put<ApiResponse<Product>>(`${this.baseUrl}/${id}`, formData)
      .pipe(
        map(response => response.data)
      );
  }

  // Xóa sản phẩm theo id
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  // Trong file product.service.ts, thêm các phương thức sau:


  // Ví dụ: Lấy danh sách màu sắc
  getColorOptions(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/api/colors`)
      .pipe(
        map(response => response.data) // Lấy mảng "colors" từ data
      );
  }

  // Ví dụ: Lấy danh sách size
  getSizeOptions(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/api/sizes`)
      .pipe(
        map(response => response.data)
      );
  }

  // Ví dụ: Lấy danh sách chất liệu
  getMaterialOptions(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/api/materials`)
      .pipe(
        map(response => response.data)
      );
  }

  // Ví dụ: Lấy danh sách brand
  getBrandOptions(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/api/brands`)
      .pipe(
        map(response => response.data)
      );
  }
}
