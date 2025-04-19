import { Component, OnInit } from '@angular/core';
import { ProductsFeaturesComponent } from '../shared/products-features/products-features.component';
import { Product, ProductItem } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {SectionsState} from '../../core/models/api-response.models'

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    ProductsFeaturesComponent, 
    CommonModule, 
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  isLoading = true;
  errorMessage: string | null = null;
  productForm: FormGroup;

  sectionsState = {
    information: false,
    details: false,
    custom: false,
    review: false
  };

  // Biến lưu trữ các thông tin cần thiết
  uniqueColors: { colorId: number; colorName: string; hexCode: string }[] = [];
  availableSizes: { sizeId: number; sizeName: string }[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      selectedColor: [null],
      selectedSize: [null],
      quantity: [1]
    });
  }

  toggleSection(section: keyof SectionsState): void {
    this.sectionsState[section] = !this.sectionsState[section];
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });

    this.productForm.get('selectedColor')?.valueChanges.subscribe(colorId => {
      this.updateAvailableSizes(colorId);
      this.productForm.patchValue({ selectedSize: null }); // Reset size khi đổi màu
    });

    this.sectionsState.information = true;
  }

  private loadProduct(productId: number): void {
    this.productService.getProductById(productId).subscribe({
      next: (response) => {
        this.product = response.data;
        this.processProductData();
        this.initializeForm();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Lỗi khi tải thông tin sản phẩm';
        this.isLoading = false;
      }
    });
  }

  isSizeAvailable(sizeId: number): boolean {
    const selectedColorId = this.productForm.value.selectedColor;
    if (!selectedColorId) return false;
  
    const productItem = this.product.productItems.find(
      item => item.colorId === selectedColorId && item.sizeId === sizeId
    );
  
    return productItem ? productItem.stock > 0 : false;
  }


  private processProductData(): void {
    // Xử lý màu sắc
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

    // Xử lý size
    this.updateAvailableSizes();
  }

  private sanitizeHexCode(hex: string): string {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i;
    return hexRegex.test(hex) ? hex : '#cccccc';
  }

  private initializeForm(): void {
    // Khởi tạo giá trị mặc định
    if (this.uniqueColors.length > 0) {
      this.productForm.patchValue({
        selectedColor: this.uniqueColors[0].colorId
      });
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
        sizeMap.set(item.sizeId, {
          sizeId: item.sizeId,
          sizeName: item.sizeName
        });
      });
  
    this.availableSizes = Array.from(sizeMap.values());
    
    // Cập nhật size mặc định nếu có kích thước nào và chưa có kích thước được chọn
    if (this.availableSizes.length > 0 && !this.productForm.value.selectedSize) {
      this.productForm.patchValue({
        selectedSize: this.availableSizes[0].sizeId
      });
    }
  }
  

  // Helper function cho template
  get selectedColorHex(): string {
    const color = this.uniqueColors.find(
      c => c.colorId === this.productForm.value.selectedColor
    );
    return color?.hexCode || '#cccccc';
  }

  trackByColorId(index: number, color: any): number {
    return color.colorId;
  }

  trackBySizeId(index: number, size: any): number {
    return size.sizeId;
  }
  
}