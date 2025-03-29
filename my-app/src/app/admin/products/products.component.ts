import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product, ProductItem, ProductImage } from '../../core/model/product.model';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/model/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-product',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  
  productForm: FormGroup;
  showModal: boolean = false;
  isEditMode: boolean = false;
  currentProductId: number | null = null;
  imageFiles: File[] = [];
  imagePreviews: { url: string, isMain: boolean }[] = [];
  
  searchQuery: string = '';
  totalProducts: number = 0;
  outOfStockCount: number = 0;
  lowStockCount: number = 0;
  loading: boolean = false;


  showGallery: boolean = false;
  galleryImages: string[] = [];
  currentGalleryIndex: number = 0;

  showDeleteConfirm: boolean = false;
  productToDelete: number | null = null;

  colorOptions: { id: number, name: string, value: string }[] = [];
  sizeOptions: { id: number, name: string, value: string }[] = [];
  materialOptions: { id: number, name: string, value: string }[] = [];
  brands: any[] = [];

  loadingOptions: boolean = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      categoryId: [null, Validators.required],
      brandId: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      colorId: [null, Validators.required],      
      sizeId: [null, Validators.required],      
      materialId: [null, Validators.required]   
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadOptions(); 
    
  }


  loadOptions(): void {
    this.loadingOptions = true;
    forkJoin({
      colors: this.productService.getColorOptions(),
      sizes: this.productService.getSizeOptions(),
      materials: this.productService.getMaterialOptions(),
      brands: this.productService.getBrandOptions() // Lấy danh sách thương hiệu
    }).subscribe({
      next: (response) => {
        this.colorOptions = response.colors || [];
        this.sizeOptions = response.sizes || [];
        this.materialOptions = response.materials || [];
        this.brands = response.brands || []; // Gán danh sách thương hiệu
  
        this.loadingOptions = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải dữ liệu:', err);
        this.loadingOptions = false;
      }
    });
  }
  

  loadCategories(): void {
    this.categoryService.getRootCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products || []; // đảm bảo this.products luôn là mảng
        this.filteredProducts = [...this.products];
        this.updateStockCounts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.products = [];
        this.loading = false;
      }
    });
  }
  

  updateStockCounts(): void {
    this.totalProducts = this.products.length;
    this.outOfStockCount = this.products.filter(
      product => product.productItems[0]?.stock === 0
    ).length;
    this.lowStockCount = this.products.filter(
      product => (product.productItems[0]?.stock || 0) > 0 && 
                 (product.productItems[0]?.stock || 0) < 10
    ).length;
  }

  filterProducts(): void {
    if (!this.searchQuery) {
      this.filteredProducts = [...this.products];
      return;
    }
    const query = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query)) ||
      this.getCategoryName(product.categoryId ?? 0).toLowerCase().includes(query)
    );
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  }
  
  getMainImage(images: ProductImage[] | string[]): string {
    if (!images || images.length === 0) {
      return '';
    }
    // Nếu mảng chứa chuỗi (URL)
    if (typeof images[0] === 'string') {
      return images[0];
    }
    // Nếu mảng chứa đối tượng ProductImage
    const main = (images as ProductImage[]).find(img => img.isMain);
    return main ? main.imageUrl : (images as ProductImage[])[0].imageUrl;
  }
  

  getStockStatus(stock: number | undefined): { class: string, text: string } {
    if (stock === undefined || stock === null) return { class: 'unknown', text: 'N/A' };
    if (stock === 0) return { class: 'out', text: 'Out of Stock' };
    if (stock < 10) return { class: 'low', text: 'Low Stock' };
    return { class: 'in', text: 'In Stock' };
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentProductId = null;
    this.productForm.reset({ size: 'L' });
    this.imagePreviews = [];
    this.imageFiles = [];
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.isEditMode = true;
    this.currentProductId = product.id;
    console.log('Sản phẩm cần edit:', product);

    const productItem = product.productItems[0] || {};
  
    this.productForm.patchValue({
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId,
      brandId: product.brandId,    
      price: productItem.price || 0,
      stock: productItem.stock || 0,
      colorId: productItem.colorId || null,       
      sizeId: productItem.sizeId || null,         
      materialId: productItem.materialId || null
    });
    
    this.imagePreviews = (product.images || []).map((img: any, index: number) => ({
      url: typeof img === 'string' ? img : img.imageUrl,
      isMain: index === 0 
    }));
    this.imageFiles = [];
    
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.imageFiles.push(file);
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push({
          url: e.target.result,
          isMain: this.imagePreviews.length === 0
        });
      };
      reader.readAsDataURL(file);
    }
  }

  setMainImage(index: number): void {
    this.imagePreviews.forEach((img, i) => {
      img.isMain = i === index;
    });
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    if (this.imageFiles.length > index) {
      this.imageFiles.splice(index, 1);
    }
    if (!this.imagePreviews.some(img => img.isMain) && this.imagePreviews.length > 0) {
      this.imagePreviews[0].isMain = true;
    }
  }

  submitForm(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    
    const productData = this.prepareProductData();
    
    if (this.isEditMode && this.currentProductId) {
      this.updateProduct(this.currentProductId, productData);
    } else {
      this.createProduct(productData);
    }
  }

  private prepareProductData(): Partial<Product> {
    const formValue = this.productForm.value;
    
    // Tạo productItem
    const productItem: Partial<ProductItem> = {
      price: formValue.price,
      stock: formValue.stock,
      colorId: formValue.colorId,
      colorName: this.colorOptions.find(c => c.id === +formValue.colorId)?.name || '',
      sizeId: +formValue.sizeId,
      sizeName: this.sizeOptions.find(s => s.id === +formValue.sizeId)?.name || '',
      materialId: +formValue.materialId,
      materialName: this.materialOptions.find(m => m.id === +formValue.materialId)?.name || '',
      sku: '',
      images: this.imagePreviews.map(img => ({
        imageUrl: typeof img.url === 'string' ? img.url : '',
        isMain: img.isMain
      }))
    };
  
    return {
      name: formValue.name,
      description: formValue.description,
      categoryId: formValue.categoryId,
      brandId: formValue.brandId,
      productItems: [productItem as ProductItem]
    };
  }
  
  
  

  private buildFormData(productData: Partial<Product>): FormData {
    const formData = new FormData();
    formData.append('product', JSON.stringify(productData));
    if (this.imageFiles && this.imageFiles.length > 0) {
      for (let i = 0; i < this.imageFiles.length; i++) {
        formData.append('files', this.imageFiles[i]);
      }
    }
    return formData;
  }

  private createProduct(productData: Partial<Product>): void {
    const formData = this.buildFormData(productData);
    this.productService.createProduct(formData).subscribe({
      next: (createdProduct) => {
        this.loadProducts();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating product:', err);
      }
    });
  }

  private updateProduct(id: number, productData: Partial<Product>): void {
    const formData = this.buildFormData(productData);
    this.productService.updateProduct(id, formData).subscribe({
      next: (updatedProduct) => {
        this.loadProducts();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating product:', err);
      }
    });
  }


  // Phương thức mở gallery xem ảnh
openGallery(images: ProductImage[] | string[], index: number = 0): void {
  if (!images || images.length === 0) return;
  
  // Chuyển đổi mảng ảnh thành mảng URL string
  if (typeof images[0] === 'string') {
    this.galleryImages = images as string[];
  } else {
    this.galleryImages = (images as ProductImage[]).map(img => img.imageUrl);
  }
  
  this.currentGalleryIndex = index;
  this.showGallery = true;
}

// Phương thức đóng gallery
closeGallery(): void {
  this.showGallery = false;
  this.galleryImages = [];
}

// Phương thức mở modal xác nhận xóa
openDeleteConfirm(productId: number): void {
  this.productToDelete = productId;
  this.showDeleteConfirm = true;
}

// Phương thức hủy xóa
cancelDelete(): void {
  this.showDeleteConfirm = false;
  this.productToDelete = null;
}

// Phương thức xóa sản phẩm (đã điều chỉnh từ phương thức deleteProduct cũ)
deleteProduct(id: number): void {
  if (this.productToDelete) {
    this.productService.deleteProduct(this.productToDelete).subscribe({
      next: () => {
        this.loadProducts();
        this.showDeleteConfirm = false;
        this.productToDelete = null;
      },
      error: (err) => {
        console.error('Error deleting product:', err);
        this.showDeleteConfirm = false;
        this.productToDelete = null;
      }
    });
  }
}

// Phương thức chuyển ảnh trong gallery
  navigateGallery(direction: 'prev' | 'next'): void {
    if (direction === 'prev') {
      this.currentGalleryIndex = (this.currentGalleryIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
    } else {
      this.currentGalleryIndex = (this.currentGalleryIndex + 1) % this.galleryImages.length;
    }
  }
}


