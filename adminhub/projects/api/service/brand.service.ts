import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand } from '../model/brand.model';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}


  getAllBrands(): Observable<ApiResponse<Brand[]>> {
    return this.http.get<ApiResponse<Brand[]>>(`${this.apiUrl}/api/brands`);
  }

  createBrand(brand: Brand, file?: File): Observable<ApiResponse<Brand>> {
    const formData = new FormData();
    formData.append('brand', JSON.stringify(brand)); // Gửi đối tượng brand dưới dạng JSON string
    if (file) {
      formData.append('file', file);
    }
    return this.http.post<ApiResponse<Brand>>(
      `${this.apiUrl}/api/brands`,
      formData
    );
  }

  updateBrand(
    id: number,
    brand: Brand,
    file?: File,
    shouldDeleteOldLogo: boolean = false
  ): Observable<ApiResponse<Brand>> {
    const formData = new FormData();
    formData.append('brand', JSON.stringify(brand));
    if (file) {
      formData.append('file', file);
    }
    formData.append('shouldDeleteOldLogo', shouldDeleteOldLogo.toString());
    return this.http.put<ApiResponse<Brand>>(
      `${this.apiUrl}/api/brands/${id}`,
      formData
    );
  }

  // Xóa thương hiệu
  deleteBrand(id: number, deleteLogo: boolean = true): Observable<ApiResponse<any>> {
    const params = { deleteLogo: deleteLogo.toString() };
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/api/brands/${id}`,
      { params }
    );
  }
}
