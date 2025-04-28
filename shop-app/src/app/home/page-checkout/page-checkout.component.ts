// src/app/home/page-checkout/page-checkout.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItem } from '../../core/models/cart.model';
import { CartService } from '../../core/services/cart.service';
import { AddressService } from '../../core/services/address.service';
import { OrderService } from '../../core/services/order.service';
import { AddressResponse, AddressRequest } from '../../core/models/address.models';
import { ApiResponse } from '../../core/models/api-response.models';

@Component({
  selector: 'app-page-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './page-checkout.component.html',
  styleUrls: ['./page-checkout.component.css']
})
export class PageCheckoutComponent implements OnInit, OnDestroy {
  addressForm!: FormGroup;
  addresses: AddressResponse[] = [];
  selectedAddress: AddressResponse | null = null;
  isEditing = false;

  // Items for checkout
  selectedItems: CartItem[] = [];
  private selectionSub?: Subscription;

  orderSummary = {
    subtotal: 0,
    discount: 0,
    shippingFee: 30000,
    total: 0
  };

  // Address dropdown data
  provinces: string[] = [];
  districts: string[] = [];
  wards: string[] = [];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private addressService: AddressService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAddresses();
    this.loadDefaultAddress();
    this.selectionSub = this.cartService.selectedItems$.subscribe(items => {
      this.selectedItems = items;
      if (!items.length) {
        this.router.navigate(['/cart']);
      }
      this.calculateSummary();
    });
  }

  ngOnDestroy(): void {
    this.selectionSub?.unsubscribe();
  }

  private initForm(): void {
    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/)]],
      province: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
      detail: ['', Validators.required],
      isDefault: [false]
    });
    // Load provinces dynamically or static list
    this.provinces = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng'];
  }

  private loadAddresses(): void {
    this.addressService.getAllAddresses().subscribe({
      next: (res: ApiResponse<AddressResponse[]>) => this.addresses = res.data,
      error: err => console.error('Load addresses failed:', err)
    });
  }

  private loadDefaultAddress(): void {
    this.addressService.getDefaultAddress().subscribe({
      next: (res: ApiResponse<AddressResponse>) => {
        this.selectedAddress = res.data;
        this.patchForm(res.data);
        this.onProvinceChange(res.data.province);
      },
      error: err => console.error('Load default address failed:', err)
    });
  }

  onProvinceChange(province: string): void {
    this.districts = ['Quận 1', 'Quận 2', 'Quận 3'];
    this.wards = [];
    this.addressForm.patchValue({ province, district: '', ward: '' });
  }

  onDistrictChange(district: string): void {
    this.wards = ['Phường 1', 'Phường 2', 'Phường 3'];
    this.addressForm.patchValue({ district, ward: '' });
  }

  selectAddress(address: AddressResponse): void {
    this.selectedAddress = address;
    this.isEditing = false;
    this.patchForm(address);
    this.onProvinceChange(address.province);
    this.onDistrictChange(address.district);
  }

  editAddress(): void {
    this.isEditing = true;
  }

  saveAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    const req: AddressRequest = this.addressForm.value;
    const op = this.selectedAddress
      ? this.addressService.updateAddress(this.selectedAddress.id, req)
      : this.addressService.createAddress(req);
    op.subscribe({
      next: () => {
        this.loadAddresses();
        this.loadDefaultAddress();
        this.isEditing = false;
      },
      error: err => console.error('Save address failed:', err)
    });
  }

  deleteAddress(id: number): void {
    if (!confirm('Bạn chắc chắn xóa địa chỉ?')) return;
    this.addressService.deleteAddress(id).subscribe({
      next: () => this.loadAddresses(),
      error: err => console.error('Delete address failed:', err)
    });
  }

  private patchForm(addr: AddressResponse): void {
    this.addressForm.patchValue({
      fullName: addr.fullName,
      phone: addr.phone,
      province: addr.province,
      district: addr.district,
      ward: addr.ward,
      detail: addr.detail,
      isDefault: addr.isDefault
    });
  }

  private calculateSummary(): void {
    const subtotal = this.selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    this.orderSummary.subtotal = subtotal;
    this.orderSummary.discount = 0;
    this.orderSummary.shippingFee = this.orderSummary.shippingFee;
    this.orderSummary.total = subtotal + this.orderSummary.shippingFee;
  }

  placeOrder(): void {
    if (!this.selectedAddress) {
      alert('Chọn địa chỉ giao hàng');
      return;
    }
    if (!this.selectedItems.length) {
      alert('Giỏ hàng trống');
      return;
    }
    const orderReq = {
      addressId: this.selectedAddress.id,
      orderItems: this.selectedItems.map(i => ({ productItemId: i.productItemId, quantity: i.quantity }))
    };
    this.orderService.createOrder(orderReq).subscribe({
      next: res => {
        this.cartService.clearCart(Number(localStorage.getItem('userId'))).subscribe(() => {
          this.router.navigate(['/order-confirmation', res.data.id]);
        });
      },
      error: err => alert('Đặt hàng thất bại: ' + (err.error?.message || ''))
    });
  }
}
