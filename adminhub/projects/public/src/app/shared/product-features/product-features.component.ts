import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../../../api/service/product.service';
import { Product } from '../../../../../api/model/product.model';

@Component({
  selector: 'app-product-features',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './product-features.component.html',
  styleUrl: './product-features.component.scss'
})
export class ProductFeaturesComponent  implements OnInit {
  products: Product[] = []; 

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách sản phẩm:', err);
      }
    });
  }

  getDiscount(product: Product): number {
    // return product.productItems[0]?.discount || 0;
    return 10;
  }

  getPrice(product: Product): number {
    return product.productItems[0]?.price || 0;
  }

  getOriginalPrice(product: Product): number {
    const discount = this.getDiscount(product);
    return discount ? this.getPrice(product) / (1 - discount / 100) : this.getPrice(product);
  }
  
  getProductImage(product: Product): string {
    if (product?.images && product.images.length > 0) {
      // Nếu phần tử đầu tiên là chuỗi, trả về nó
      if (typeof product.images[0] === 'string') {
        return product.images[0];
      }
      // Nếu là đối tượng, kiểm tra xem có ảnh chính không
      const mainImage = product.images.find((img: any) => img.isMain);
      return mainImage ? mainImage.imageUrl : product.images[0].imageUrl;
    }
    return '/assets/img/default.jpg';
  }
  
  
  
  
  
  

}
