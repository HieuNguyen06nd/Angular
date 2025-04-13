import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products-features',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products-features.component.html',
  styleUrls: ['./products-features.component.css']
})
export class ProductsFeaturesComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => this.products = res.data,
      error: (err) => console.error('Lỗi khi load sản phẩm:', err)
    });
  }
}
