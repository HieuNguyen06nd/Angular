import { Component, OnInit } from '@angular/core';
import { Product, ProductItem } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { StatusDisplayPipe } from '../../pipes/status-display.pipe';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  imports: [CommonModule, ReactiveFormsModule, StatusDisplayPipe],
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: any[] = [];
  currentImages: string[] = []; 
  deletedImages: string[] = [];
  totalProducts = 0;
  totalStock = 0;
  activeProducts = 0;
  loading = false;
  mainImageIndex = 0;

  productForm!: FormGroup;
  showProductForm = false;
  isEditMode = false;
  formData = new FormData();

  brands: any[] = [];
  colors: any[] = [];
  sizes: any[] = [];
  materials: any[] = [];

  selectedCategoryPath: any[] = [];
  currentLevelCategories: any[] = [];
  selectedProduct: Product | null = null;


  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadInitialData();
  }

  private initForm() {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', Validators.maxLength(1000)],
      categoryId: [null, Validators.required],
      brandId: [null, Validators.required],
      productItems: this.fb.array([]),
    });
  }

  get productItems() {
    return this.productForm.get('productItems') as FormArray;
  }

  private loadInitialData() {
    this.loading = true;
    Promise.all([
      this.loadProducts(),
      this.loadDropdownOptions(),
      this.loadRootCategories()
    ]).finally(() => this.loading = false);
  }

  // Region: Image Handling

  // Khi chọn ảnh mới, ta chuyển file sang DataURL lưu vào currentImages
  onFileSelected(event: any) {

    const files: FileList = event.target.files;
    if (files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Lưu DataURL (ảnh mới)
        this.currentImages.push(e.target.result);

        console.log('Added image:', e.target.result); // Xác nhận ảnh được thêm
      };
      reader.readAsDataURL(file);
    });
  }

  // Khi xóa, nếu ảnh không ở dạng DataURL (nghĩa là đã được lưu trước đó), thêm vào deletedImages
  removeImage(index: number) {
    const image = this.currentImages[index];
    if (!image.startsWith('data:image')) {
      this.deletedImages.push(image);
      console.log('[DEBUG] Added to deletedImages:', image);
    }
    // Xóa ảnh khỏi mảng
    this.currentImages.splice(index, 1);
    // Reassign để Angular cập nhật giao diện
    this.currentImages = [...this.currentImages];

    console.log('[DEBUG] Current Images:', this.currentImages);
    console.log('[DEBUG] Deleted Images:', this.deletedImages);
  }
  

  // Region: Product Items
  addVariant() {
    this.productItems.push(this.fb.group({
      id: [null],
      sku: ['', [ Validators.maxLength(50)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      colorId: [null, Validators.required],
      sizeId: [null, Validators.required],
      materialId: [null, Validators.required],
      status: ['ACTIVE', Validators.required]
    }));
  }

  removeVariant(index: number) {
    const variant = this.productItems.at(index);
    if (variant.get('id')?.value) {
      if (confirm('Bạn muốn thay đổi trạng thái biến thể này?')) {
        // Chuyển trạng thái theo logic nghiệp vụ
        const newStatus = variant.value.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        variant.patchValue({ status: newStatus });
        this.toastr.info('Đã cập nhật trạng thái');
      }
    } else {
      this.productItems.removeAt(index);
    }
  }
  
  // End Region

  // Region: Form Operations
  onSubmit() {
    if (this.productForm.invalid || !this.validateForm()) {
      console.log('Form invalid! Errors:', this.productForm.errors);
      this.markFormAsTouched();
      return;
    }

    this.loading = true;
    this.prepareFormData();

    const serviceCall = this.isEditMode
      ? this.productService.updateProduct(this.productForm.value.id, this.formData)
      : this.productService.createProduct(this.formData);

      // Trong onSubmit()
      serviceCall.subscribe({
        next: (response) => {
          console.log('API Response Data:', response); // Log phản hồi từ server
          this.handleSuccess();
        },
        error: (err) => {
          console.error('API Error Details:', err); // Log chi tiết lỗi
          console.error('Error Response Body:', err.error); // Log nội dung lỗi từ server
          this.handleError(err);
        }
      });
  }

  private validateForm(): boolean {
    // Kiểm tra ảnh
    if (this.currentImages.length === 0) {
      this.toastr.error('Vui lòng thêm ít nhất 1 ảnh');
      return false;
    }
  
    // Kiểm tra từng biến thể
    this.productItems.value.forEach((item: any, index: number) => {
      console.log(`[DEBUG] Variant ${index + 1} status:`, item.status);
    });
  
    // Kiểm tra có ít nhất 1 biến thể ACTIVE/SOLD_OUT
    const validItems = this.productItems.controls.filter(
      (item) => item.get('status')?.value === 'ACTIVE' || item.get('status')?.value === 'SOLDOUT'
    );
    
    if (validItems.length === 0) {
      this.toastr.error('Cần ít nhất 1 biến thể đang hoạt động hoặc hết hàng');
      return false;
    }
  
    return true;
  }

  private prepareFormData() {
    this.formData = new FormData();

    // Phân tách ảnh mới (dạng DataURL) và ảnh cũ (URL)
    const newImages = this.currentImages.filter(img => img.startsWith('data:image'));
    const existingImages = this.currentImages.filter(img => !img.startsWith('data:image'));

    // Thêm file ảnh mới vào FormData với key "files" (để backend nhận theo mapping)
    newImages.forEach(img => {
      const file = this.getFileFromDataUrl(img);
      if (file) {
        this.formData.append('files', file);
      }
    });

    // Chuẩn bị dữ liệu sản phẩm: gửi ảnh cũ và danh sách ảnh cần xóa
    const productData = {
      ...this.productForm.value,
      images: existingImages,
      deletedImages: this.deletedImages,
      productItems: this.productItems.value.map((item: any) => ({
        ...item,
        status: item.status.toUpperCase()
      }))
    };

    this.formData.append('product', JSON.stringify(productData));
  }

  // Hàm chuyển DataURL về File
  private getFileFromDataUrl(dataUrl: string): File | null {
    try {
      const parts = dataUrl.split(',');
      if (parts.length < 2) return null;

      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : '';
      const byteString = atob(parts[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uintArray = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
      }

      return new File([uintArray], `product_image_${Date.now()}`, { type: mime });
    } catch (e) {
      console.error('Error converting data URL to file:', e);
      return null;
    }
  }

  private markFormAsTouched() {
    Object.values(this.productForm.controls).forEach(control => {
      control.markAsTouched();
    });
    this.toastr.warning('Vui lòng điền đầy đủ thông tin');
  }
  // End Region

  // Region: Data Loading
  private loadProducts() {
    return new Promise<void>((resolve) => {
      this.productService.getAllProducts().subscribe({
        next: (response) => {
          this.products = response.data;
          this.calculateStats();
          resolve();
        },
        error: (err) => {
          this.showError('Lỗi tải sản phẩm', err);
          resolve();
        }
      });
    });
  }

  private loadDropdownOptions() {
    return new Promise<void>((resolve) => {
      Promise.all([
        this.productService.getColorOptions().toPromise(),
        this.productService.getSizeOptions().toPromise(),
        this.productService.getMaterialOptions().toPromise(),
        this.productService.getBrandOptions().toPromise()
      ]).then(([colors, sizes, materials, brands]) => {
        this.colors = colors || [];
        this.sizes = sizes || [];
        this.materials = materials || [];
        this.brands = brands || [];
        resolve();
      }).catch((err) => {
        this.showError('Lỗi tải dữ liệu', err);
        resolve();
      });
    });
  }

  private loadRootCategories() {
    this.categoryService.getRootCategories().subscribe({
      next: (categories) => {
        this.currentLevelCategories = categories;
      },
      error: (error) => this.showError('Lỗi tải danh mục', error)
    });
  }

  private calculateStats() {
    this.totalProducts = this.products.length;
    
    this.totalStock = this.products.reduce((total, product) => {
      return total + product.productItems.reduce((sum, item) => sum + item.stock, 0);
    }, 0);
  
    this.activeProducts = this.products.filter(product => 
      product.productItems.some(item => 
        item.status === 'ACTIVE' || item.status === 'SOLDOUT'
      )
    ).length;
  }
  // End Region

  // Region: Product CRUD
  addProduct() {
    this.resetFormState();
    this.showProductForm = true;
  }

  editProduct(product: Product) {
    this.resetFormState();
    this.isEditMode = true;
    this.showProductForm = true;

    this.productService.getProductById(product.id).subscribe({
      next: (response) => this.populateForm(response.data),
      error: (err) => this.showError('Lỗi tải sản phẩm', err),
    });
  }

  deleteProduct(product: Product) {
    if (confirm(`Xóa sản phẩm "${product.name}"?`)) {
      this.loading = true;
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.loadProducts();
          this.toastr.success('Đã xóa sản phẩm');
          this.loading = false;
        },
        error: (err) => {
          this.showError('Lỗi xóa sản phẩm', err);
          this.loading = false;
        }
      });
    }
  }
  private populateForm(product: Product) {
    this.productForm.reset();
    this.currentImages = [...product.images];
  
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      brandId: product.brandId,
    });
  
    this.productItems.clear();
    product.productItems.forEach(item => {
      this.addExistingVariant(item);
    });
  
    // Load category path
    this.loadCategoryPath(product.categoryId);
  }

  private loadCategoryPath(categoryId: number) {
    this.categoryService.getCategoryParents(categoryId).subscribe({
      next: (categories) => {
        this.selectedCategoryPath = categories;
        
        // Load danh sách con của danh mục cuối cùng
        if (this.selectedCategoryPath.length > 0) {
          const currentCategory = this.selectedCategoryPath[this.selectedCategoryPath.length - 1];
          this.currentLevelCategories = currentCategory.children || [];
          this.productForm.patchValue({ categoryId: currentCategory.id });
        }
      },
      error: (err) => this.toastr.error('Không thể load danh mục')
    });
  }

  initCategorySelection() {
    this.selectedCategoryPath = [];
    this.categoryService.getRootCategories().subscribe({
      next: (categories) => {
        this.currentLevelCategories = categories;
      },
      error: (err) => {
        this.toastr.error('Không thể load danh mục');
      }
    });
  }

  // Xử lý khi chọn danh mục
  onSelectCategory(category: Category, level: number) {
    // Cập nhật path
    this.selectedCategoryPath = this.selectedCategoryPath.slice(0, level);
    this.selectedCategoryPath.push(category);
  
    // Load danh mục con
    this.currentLevelCategories = category.children || [];
    
    // Nếu là danh mục lá - cập nhật form
    if (this.currentLevelCategories.length === 0) {
      this.productForm.patchValue({ categoryId: category.id });
    }
  }

private loadCategoryPathForEdit(categoryId: number) {
  this.categoryService.getCategoryParents(categoryId).subscribe({
    next: (categories) => {
      // Đảo ngược mảng để có thứ tự từ root -> current
      this.selectedCategoryPath = categories.reverse(); 
      
      // Load danh sách con của danh mục cuối cùng
      if (this.selectedCategoryPath.length > 0) {
        const currentCategory = this.selectedCategoryPath[this.selectedCategoryPath.length - 1];
        this.currentLevelCategories = currentCategory.children || [];
        
        // Set giá trị categoryId cho form
        this.productForm.patchValue({ categoryId: currentCategory.id });
      }
    },
    error: (err) => {
      this.toastr.error('Không thể load đường dẫn danh mục');
    }
  });
}
// Reset selection
resetCategorySelection() {
  this.selectedCategoryPath = [];
  this.categoryService.getRootCategories().subscribe({
    next: (categories) => {
      this.currentLevelCategories = categories;
      this.productForm.patchValue({ categoryId: null });
    }
  });
}

  private addExistingVariant(item: ProductItem) {
    this.productItems.push(this.fb.group({
      id: [item.id],
      sku: [item.sku, [Validators.maxLength(50)]],
      price: [item.price, [Validators.required, Validators.min(0)]],
      newPrice: [item.newPrice ?? null],
      stock: [item.stock, [Validators.required, Validators.min(0)]],
      colorId: [item.colorId, Validators.required],
      sizeId: [item.sizeId, Validators.required],
      materialId: [item.materialId, Validators.required],
      discountId: [item.discountId ?? null],
      discountPercent: [item.discountPercent ?? null],
      status: [item.status || 'ACTIVE', Validators.required]
    }));
  }

  private resetFormState() {
    this.productForm.reset();
    this.formData = new FormData();
    this.currentImages = [];
    this.productItems.clear();
    this.deletedImages = [];
    this.selectedCategoryPath = [];
    this.loadRootCategories();
  }
  // End Region

  // Region: Helpers
  private handleSuccess() {
    this.toastr.success('Thao tác thành công');
    this.resetFormState();
    this.loadInitialData();
    this.showProductForm = false;
    this.cdr.detectChanges();
  }

  private handleError(err: any) {
    console.error('Error:', err);
    const message = err?.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
    this.toastr.error(message);
    this.loading = false;
  }

  private showError(context: string, err: any) {
    console.error(context, err);
    this.toastr.error(`${context}: ${err.message}`);
  }

  getTotalStock(product: Product): number {
    return product.productItems.reduce((sum, item) => sum + item.stock, 0);
  }

  toggleProductItems(product: Product) {
    product.collapsed = !product.collapsed;
  }


  cancelForm() {
    this.showProductForm = false;
    this.resetFormState();
  }
  // End Region
}
