import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ApiResponse } from '../models/api-response.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Sử dụng environment để lấy URL gốc
  private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) {}

  // Lấy tất cả sản phẩm
  getAllProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl);
  }

  // Lấy chi tiết sản phẩm theo id
  getProductById(productId: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${productId}`);
  }

  // Lấy sản phẩm nổi bật
  getTrendingProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/trending`);
  }

  // Tạo sản phẩm mới (sử dụng FormData cho multipart/form-data)
  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, formData).pipe(
      map(response => response.data)
    );
  }

  // Cập nhật sản phẩm
  updateProduct(id: number, formData: FormData): Observable<Product> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, formData).pipe(
      map(response => response.data)
    );
  }

  // Xóa sản phẩm theo id
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  // Lấy danh sách màu sắc
  getColorOptions(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/api/colors`)
      .pipe(
        map(response => response.data)
      );
  }

  // Lấy danh sách size
  getSizeOptions(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/api/sizes`)
      .pipe(
        map(response => response.data)
      );
  }

  // Lấy danh sách chất liệu
  getMaterialOptions(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/api/materials`)
      .pipe(
        map(response => response.data)
      );
  }

  // Lấy danh sách thương hiệu
  getBrandOptions(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/api/brands`)
      .pipe(
        map(response => response.data)
      );
  }
}
