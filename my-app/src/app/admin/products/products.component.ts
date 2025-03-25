import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../core/services/product.service'; // Điều chỉnh đường dẫn

interface Product {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  brandId: number;
  productItems: ProductItem[];
  updatedAt?: string;
}

interface ProductItem {
  id?: number;
  colorId?: number;
  sizeId?: number;
  materialId?: number;
  price: number;
  stock: number;
  images?: ProductImage[];
}

interface ProductImage {
  imageUrl: string;
  isMain: boolean;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  showModal: boolean = false;
  currentProductId: number | null = null;
  productFormData: Partial<Product> = { 
    productItems: [{ price: 0, stock: 0 }] // Khởi tạo với giá trị mặc định
  };

  // Stats
  totalProducts: number = 0;
  outOfStockCount: number = 0;
  lowStockCount: number = 0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.updateStats();
      },
      error: (err: any) => console.error('Error loading products', err)
    });
  }

  filterProducts(): void {
    if (!this.searchQuery) {
      this.filteredProducts = [...this.products];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.description && p.description.toLowerCase().includes(query))
      );
    }
  }

  updateStats(): void {
    this.totalProducts = this.products.length;
    this.outOfStockCount = this.products.filter(p => 
      p.productItems.some(item => item.stock === 0)
    ).length;
    this.lowStockCount = this.products.filter(p => 
      p.productItems.some(item => item.stock > 0 && item.stock < 10)
    ).length;
  }

  getStockStatus(stock: number): { text: string; class: string } {
    if (stock === 0) {
      return { text: 'Out of Stock', class: 'out-of-stock' };
    } else if (stock < 10) {
      return { text: 'Low Stock', class: 'low-stock' };
    } else {
      return { text: 'In Stock', class: 'in-stock' };
    }
  }

  openAddModal(): void {
    this.currentProductId = null;
    this.productFormData = { productItems: [{ price: 0, stock: 0 }] };
    this.showModal = true;
  }

  editProduct(id: number): void {
    const product = this.products.find(p => p.id === id);
    if (product) {
      this.currentProductId = id;
      this.productFormData = { ...product };
      this.showModal = true;
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err: any) => console.error('Error deleting product', err)
      });
    }
  }

  submitForm(): void {
    const productData = {
      ...this.productFormData,
      productItems: this.productFormData.productItems?.map(item => ({
        ...item,
        price: Number(item.price),
        stock: Number(item.stock)
      }))
    };

    const observable = this.currentProductId
      ? this.productService.updateProduct(this.currentProductId, productData as Product)
      : this.productService.createProduct(productData as Product);

    observable.subscribe({
      next: () => {
        this.loadProducts();
        this.closeModal();
      },
      error: (err: any) => console.error('Error saving product', err)
    });
  }

  closeModal(): void {
    this.showModal = false;
  }
}