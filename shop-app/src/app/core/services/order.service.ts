import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderResponse } from '../models/order.model';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
   private apiUrl = `${environment.apiUrl}/api/orders`;

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<ApiResponse<OrderResponse[]>> {
    return this.http.get<ApiResponse<OrderResponse[]>>(this.apiUrl);
  }
}
