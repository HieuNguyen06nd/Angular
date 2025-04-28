import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { ApiResponse } from '../models/api-response.models';
import { environment } from '../../environments/environment';

export interface AddToCartDto {
  productItemId: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/api/cart`;

  // Giỏ hàng chính
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  // Các mục được chọn
  private selectedItemsSubject = new BehaviorSubject<CartItem[]>([]);
  selectedItems$ = this.selectedItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /* API Methods */
  loadCart(userId: number): Observable<Cart> {
    return this.http.get<ApiResponse<Cart>>(`${this.apiUrl}/${userId}`).pipe(
      map(res => this._processCart(res.data)),
      tap(cart => this.cartSubject.next(cart))
    );
  }

  addToCart(userId: number, dto: AddToCartDto): Observable<Cart> {
    return this.http.post<ApiResponse<Cart>>(`${this.apiUrl}/${userId}/add`, dto).pipe(
      map(res => this._processCart(res.data)),
      tap(cart => this.cartSubject.next(cart))
    );
  }

  removeItem(userId: number, itemId: number): Observable<Cart> {
    return this.http.delete<ApiResponse<Cart>>(`${this.apiUrl}/${userId}/remove/${itemId}`).pipe(
      map(res => this._processCart(res.data)),
      tap(cart => {
        this.cartSubject.next(cart);
        this._cleanupSelectedItems(cart);
      })
    );
  }

  clearCart(userId: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${userId}/clear`).pipe(
      tap(() => {
        this.cartSubject.next(null);
        this.selectedItemsSubject.next([]);
      }),
      map(() => {})
    );
  }

  /* Selection Management */
  /** Chọn/bỏ chọn 1 item */
  toggleItemSelection(itemId: number, selected: boolean): void {
    const cart = this.cartSubject.value;
    if (!cart) return;

    const updatedItems = cart.cartItems.map(item =>
      item.id === itemId ? { ...item, selected } : item
    );

    this.cartSubject.next({ ...cart, cartItems: updatedItems });
    this._updateSelectedItems(updatedItems);
  }

  /** Chọn/bỏ chọn tất cả */
  toggleSelectAll(selected: boolean): void {
    const cart = this.cartSubject.value;
    if (!cart) return;

    const updatedItems = cart.cartItems.map(item => ({ ...item, selected }));
    this.cartSubject.next({ ...cart, cartItems: updatedItems });
    this.selectedItemsSubject.next(selected ? [...updatedItems] : []);
  }

  /* Helper Methods */
  /** Đảm bảo mọi item có thuộc tính selected */
  private _processCart(cart: Cart): Cart {
    return {
      ...cart,
      cartItems: cart.cartItems.map(item => ({
        ...item,
        selected: !!item.selected
      }))
    };
  }

  /** Cập nhật danh sách đã chọn */
  private _updateSelectedItems(items: CartItem[]): void {
    this.selectedItemsSubject.next(items.filter(item => item.selected));
  }

  /** Xóa những mục không còn trong cart */
  private _cleanupSelectedItems(cart: Cart | null): void {
    if (!cart) {
      this.selectedItemsSubject.next([]);
      return;
    }
    const currentIds = this.selectedItemsSubject.value.map(i => i.id);
    const valid = cart.cartItems.filter(i => currentIds.includes(i.id));
    this.selectedItemsSubject.next(valid);
  }
}
