import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DiscountResponse, DiscountRequest } from '../models/discount.models';
import { ApiResponse } from '../models/api-response.models';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private readonly baseUrl =  `${environment.apiUrl}/api/discounts`;

  constructor(private http: HttpClient) {}

  /** Lấy toàn bộ discounts */
  getAll(): Observable<DiscountResponse[]> {
    return this.http
      .get<ApiResponse<DiscountResponse[]>>(this.baseUrl)
      .pipe(map(res => res.data));
  }

  /** Lấy discount theo ID */
  getById(id: number): Observable<DiscountResponse> {
    return this.http
      .get<ApiResponse<DiscountResponse>>(`${this.baseUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  /** Tạo mới discount */
  create(request: DiscountRequest): Observable<DiscountResponse> {
    return this.http.post<ApiResponse<DiscountResponse>>(this.baseUrl, request)
      .pipe(map(res => res.data));
  }

  /** Cập nhật discount */
  update(id: number, request: DiscountRequest): Observable<DiscountResponse> {
    return this.http.put<ApiResponse<DiscountResponse>>(`${this.baseUrl}/${id}`, request)
      .pipe(map(res => res.data));
  }

  /** Toggle trạng thái active/inactive */
  toggleStatus(id: number): Observable<void> {
    return this.http
      .patch<ApiResponse<void>>(`${this.baseUrl}/${id}/toggle`, null)
      .pipe(map(res => res.data));
  }

  /** Lấy discounts áp dụng cho sản phẩm */
  getForProduct(productId: number): Observable<DiscountResponse[]> {
    return this.http
      .get<ApiResponse<DiscountResponse[]>>(`${this.baseUrl}/product/${productId}`)
      .pipe(map(res => res.data));
  }

  /** Lấy discounts áp dụng cho đơn hàng */
  getForOrder(): Observable<DiscountResponse[]> {
    return this.http
      .get<ApiResponse<DiscountResponse[]>>(`${this.baseUrl}/order`)
      .pipe(map(res => res.data));
  }
}