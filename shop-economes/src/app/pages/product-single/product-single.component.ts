import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ProductsFeaturesComponent } from '../../shared/products-features/products-features.component';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-single',
  imports: [CommonModule, HeaderComponent,
    FooterComponent, ProductsFeaturesComponent],
  templateUrl: './product-single.component.html',
  styleUrl: './product-single.component.css'
})
export class ProductSingleComponent implements OnInit{
  product!: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const productId = +idParam;  // chuyển sang số
      this.productService.getProductById(productId).subscribe(response => {
        this.product = response.data;
      });
    }
  }

// Trong component.ts
selectedColor: string = '';

selectColor(colorCode: string) {
  this.selectedColor = colorCode;
  // Cập nhật logic khác (ví dụ: lọc sản phẩm theo màu)
}

}
