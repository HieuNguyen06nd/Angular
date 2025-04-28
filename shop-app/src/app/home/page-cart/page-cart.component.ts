// src/app/home/page-cart/page-cart.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Cart, CartItem } from '../../core/models/cart.model';
import { CartService } from '../../core/services/cart.service';
import { Country, State, City } from 'country-state-city';

@Component({
  selector: 'app-page-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './page-cart.component.html',
  styleUrls: ['./page-cart.component.css']
})
export class PageCartComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  private cartSub?: Subscription;
  private selectionSub?: Subscription;
  private userId!: number;
  showShipping = false;

  countries = Country.getAllCountries();
  states: any[] = [];
  cities: any[] = [];

  selectedCountryIso = '';
  selectedStateIso = '';

  shippingRates = { flat: 30000, best: 45000 };
  selectedRate: 'flat' | 'best' = 'flat';

  selectedItems: CartItem[] = [];
  allSelected = false;

  constructor(
    public cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.userId = Number(localStorage.getItem('userId'));

    this.cartSub = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      if (this.cart) {
        this.allSelected = this.selectedItems.length === this.cart.cartItems.length;
      }
    });

    this.selectionSub = this.cartService.selectedItems$.subscribe(items => {
      this.selectedItems = items;
      if (this.cart) {
        this.allSelected = items.length === this.cart.cartItems.length;
      }
    });

    if (this.userId) {
      this.cartService.loadCart(this.userId).subscribe({
        error: err => console.error('Lỗi loadCart:', err)
      });
    }
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
    this.selectionSub?.unsubscribe();
  }

  increase(item: CartItem): void {
    if (!isPlatformBrowser(this.platformId) || !this.userId) return;
    this.cartService
      .addToCart(this.userId, { productItemId: item.productItemId, quantity: 1 })
      .subscribe({ error: err => console.error('Lỗi increase:', err) });
  }

  decrease(item: CartItem): void {
    if (!isPlatformBrowser(this.platformId) || !this.userId) return;
    this.cartService
      .addToCart(this.userId, { productItemId: item.productItemId, quantity: -1 })
      .subscribe({ error: err => console.error('Lỗi decrease:', err) });
  }

  remove(itemId: number, event: MouseEvent): void {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId) || !this.userId) return;
    this.cartService.removeItem(this.userId, itemId).subscribe({
      error: err => console.error('Xóa thất bại:', err)
    });
  }

  onItemCheck(itemId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.cartService.toggleItemSelection(itemId, checked);
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.cartService.toggleSelectAll(checked);
  }

  toggleShipping(event: MouseEvent): void {
    event.preventDefault();
    this.showShipping = !this.showShipping;
  }

  onCountryChange(iso: string): void {
    this.selectedCountryIso = iso;
    this.states = State.getStatesOfCountry(iso);
    this.cities = [];
  }

  onStateChange(stateIso: string): void {
    this.selectedStateIso = stateIso;
    this.cities = City.getCitiesOfState(this.selectedCountryIso, stateIso);
  }

  onRateChange(rate: 'flat' | 'best'): void {
    this.selectedRate = rate;
  }

  checkout(): void {
    if (!this.selectedItems.length) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  get subtotal(): number {
    return this.selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  get grandTotal(): number {
    return this.subtotal + this.shippingRates[this.selectedRate];
  }
}
