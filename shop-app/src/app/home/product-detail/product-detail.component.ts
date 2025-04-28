import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { ProductsFeaturesComponent } from '../shared/products-features/products-features.component';
import { Product, ProductItem } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { CartService, AddToCartDto } from '../../core/services/cart.service';
import { SectionsState } from '../../core/models/api-response.models';
import { ScrollService } from '../../core/services/scroll.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    ProductsFeaturesComponent,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  isLoading = true;
  errorMessage: string | null = null;
  productForm: FormGroup;

  sectionsState: SectionsState = {
    information: false,
    details: false,
    custom: false,
    review: false
  };

  uniqueColors: { colorId: number; colorName: string; hexCode: string }[] = [];
  availableSizes: { sizeId: number; sizeName: string }[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cartService: CartService,
    private toastr: ToastrService,
    private scrollService: ScrollService
  ) {
    this.productForm = this.fb.group({
      selectedColor: [null, Validators.required],
      selectedSize: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollService.scrollToTop();
    }, 100); // Chờ 100ms để đảm bảo DOM đã sẵn sàng
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });


    this.productForm.get('selectedColor')?.valueChanges.subscribe(colorId => {
      this.updateAvailableSizes(colorId);
      this.productForm.patchValue({ selectedSize: null });
    });

    this.sectionsState.information = true;
  }

  toggleSection(section: keyof SectionsState): void {
    this.sectionsState[section] = !this.sectionsState[section];
  }

  private loadProduct(productId: number): void {
    this.productService.getProductById(productId).subscribe({
      next: (response) => {
        this.product = response.data;
        this.processProductData();
        this.initializeForm();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Lỗi khi tải thông tin sản phẩm';
        this.isLoading = false;
      }
      
    });
  }

  private processProductData(): void {
    const colorMap = new Map<number, any>();
    this.product.productItems.forEach(item => {
      if (!colorMap.has(item.colorId)) {
        colorMap.set(item.colorId, {
          colorId: item.colorId,
          colorName: item.colorName || `Màu ${item.colorId}`,
          hexCode: this.sanitizeHexCode(item.hexCode)
        });
      }
    });

    this.uniqueColors = Array.from(colorMap.values());
    this.updateAvailableSizes();
  }

  private sanitizeHexCode(hex: string): string {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(hex) ? hex : '#cccccc';
  }

  private initializeForm(): void {
    if (this.uniqueColors.length > 0) {
      this.productForm.patchValue({ selectedColor: this.uniqueColors[0].colorId });
      this.updateAvailableSizes();
    }
  }

  private updateAvailableSizes(colorId?: number): void {
    const selectedColorId = colorId || this.productForm.value.selectedColor;
    if (!selectedColorId) return;

    const sizeMap = new Map<number, any>();
    this.product.productItems
      .filter(item => item.colorId === selectedColorId)
      .forEach(item => {
        sizeMap.set(item.sizeId, { sizeId: item.sizeId, sizeName: item.sizeName });
      });

    this.availableSizes = Array.from(sizeMap.values());

    if (this.availableSizes.length > 0 && !this.productForm.value.selectedSize) {
      this.productForm.patchValue({ selectedSize: this.availableSizes[0].sizeId });
    }
  }

  isSizeAvailable(sizeId: number): boolean {
    const selectedColorId = this.productForm.value.selectedColor;
    if (!selectedColorId) return false;

    const item = this.product.productItems.find(i => i.colorId === selectedColorId && i.sizeId === sizeId);
    return item ? item.stock > 0 : false;
  }

  get selectedColorHex(): string {
    const color = this.uniqueColors.find(c => c.colorId === this.productForm.value.selectedColor);
    return color?.hexCode || '#cccccc';
  }

  get selectedProductItem(): ProductItem | undefined {
    const { selectedColor, selectedSize } = this.productForm.value;
    return this.product.productItems.find(pi =>
      pi.colorId === selectedColor && pi.sizeId === selectedSize
    );
  }

  patchQty(delta: number): void {
    const currentQty = this.productForm.value.quantity;
    const newQty = currentQty + delta;
    this.productForm.patchValue({ quantity: newQty > 1 ? newQty : 1 });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log('Submit clicked');

    this.markAllAsTouched();
    
    // Chỉ gọi addToCart khi form hợp lệ
    if (this.productForm.valid) {
      this.addToCart();
    } else {
      this.toastr.error('Vui lòng điền đầy đủ thông tin hợp lệ!');
    }
  }  
  private markAllAsTouched(): void {
    Object.values(this.productForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  
  addToCart(): void {
    console.log('🔎 Form Value:', this.productForm.value);
console.log('🔎 Selected Product Item:', this.selectedProductItem);
console.log('🔎 User ID:', localStorage.getItem('userId'));

    if (this.productForm.invalid) {
      this.toastr.error('Vui lòng chọn đầy đủ thông tin sản phẩm!');
      return;
    }
  
    const { selectedColor, selectedSize, quantity } = this.productForm.value;
  
    if (!selectedColor || !selectedSize || quantity <= 0) {
      this.toastr.error('Vui lòng chọn màu, kích thước và số lượng hợp lệ!');
      return;
    }
  
    const selectedItem = this.selectedProductItem;
  
    if (!selectedItem) {
      this.toastr.error('Không tìm thấy sản phẩm tương ứng!');
      return;
    }
  
    if (selectedItem.stock <= 0 || selectedItem.stock < quantity) {
      this.toastr.error('Sản phẩm không đủ số lượng trong kho!');
      return;
    }
  
    const userId = this.getUserId();
    if (!userId) {
      this.toastr.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ!');
      return;
    }
  
    const dto: AddToCartDto = {
      productItemId: selectedItem.id,
      quantity
    };

    console.log('UserID:', userId); // 👈 Phải có giá trị number
    console.log('DTO:', dto); // 👈 Phải có productItemId và quantity
  
    this.cartService.addToCart(userId, dto).subscribe({
      next: () => this.toastr.success('Đã thêm sản phẩm vào giỏ hàng!'),
      error: () => this.toastr.error('Không thể thêm vào giỏ hàng, vui lòng thử lại!')
    });
  }
  
  // Tách riêng hàm lấy userId giúp dễ tái sử dụng và unit test
  private getUserId(): number | null {
    const userIdStr = localStorage.getItem('userId');
    return userIdStr ? +userIdStr : null;
    
  }
  

  // trackBy cho *ngFor
  trackByColorId(index: number, color: any): number {
    return color.colorId;
  }

  trackBySizeId(index: number, size: any): number {
    return size.sizeId;
  }
}
