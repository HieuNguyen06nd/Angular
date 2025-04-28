import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddressRequest, AddressResponse } from '../models/address.models';
import { ApiResponse } from '../models/api-response.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly API_URL = `${environment.apiUrl}/api/addresses`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  createAddress(data: AddressRequest): Observable<ApiResponse<AddressResponse>> {
    return this.http.post<ApiResponse<AddressResponse>>(
      this.API_URL, 
      data, 
      this.getAuthHeaders()
    );
  }

  getAddressById(id: number): Observable<ApiResponse<AddressResponse>> {
    return this.http.get<ApiResponse<AddressResponse>>(
      `${this.API_URL}/${id}`,
      this.getAuthHeaders()
    );
  }

  getAllAddresses(): Observable<ApiResponse<AddressResponse[]>> {
    return this.http.get<ApiResponse<AddressResponse[]>>(
      this.API_URL,
      this.getAuthHeaders()
    );
  }

  getDefaultAddress(): Observable<ApiResponse<AddressResponse>> {
    return this.http.get<ApiResponse<AddressResponse>>(
      `${this.API_URL}/default`,
      this.getAuthHeaders()
    );
  }

  updateAddress(id: number, data: AddressRequest): Observable<ApiResponse<AddressResponse>> {
    return this.http.put<ApiResponse<AddressResponse>>(
      `${this.API_URL}/${id}`,
      data,
      this.getAuthHeaders()
    );
  }

  deleteAddress(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.API_URL}/${id}`,
      this.getAuthHeaders()
    );
  }
}