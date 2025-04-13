import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Brand } from '../models/brand.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = 'http://localhost:8080/shop-store/api/brands';

  constructor(private http: HttpClient) {}

  // Lấy tất cả brands (JSON response)
  getAllBrands(): Observable<Brand[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => res.data as Brand[])
    );
  }

  // Thêm mới brand sử dụng multipart/form-data
  addBrandWithFile(formData: FormData): Observable<Brand> {
    return this.http.post<any>(this.apiUrl, formData).pipe(
      map((res) => res.data as Brand)
    );
  }

  // Cập nhật brand sử dụng multipart/form-data
  updateBrandWithFile(id: number, formData: FormData, shouldDeleteOldLogo: boolean): Observable<Brand> {
    const url = `${this.apiUrl}/${id}?shouldDeleteOldLogo=${shouldDeleteOldLogo}`;
    return this.http.put<any>(url, formData).pipe(
      map((res) => res.data as Brand)
    );
  }

  // Xóa brand
  deleteBrand(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url).pipe(
      map(() => {}) // Trả về void
    );
  }
}
