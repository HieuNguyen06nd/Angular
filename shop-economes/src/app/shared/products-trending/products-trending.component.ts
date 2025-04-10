import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { Product, ProductItem } from '../../core/models/product.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-products-trending',
  templateUrl: './products-trending.component.html'
})
export class ProductsTrendingComponent implements OnInit {
  trendingProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getTrendingProducts().subscribe(response => {
      this.trendingProducts = response.data;
    });
  }

  getStockPercent(productItem: ProductItem): number {
    const stock = productItem?.stock || 0;
    const sold = productItem?.sold || 0;
    const total = stock + sold;
    return total > 0 ? (stock / total) * 100 : 0;
  }
  
}
