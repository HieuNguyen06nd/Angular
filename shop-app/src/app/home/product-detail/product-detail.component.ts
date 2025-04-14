import { Component } from '@angular/core';
import { ProductsFeaturesComponent } from '../shared/products-features/products-features.component';

@Component({
  selector: 'app-product-detail',
  imports: [ProductsFeaturesComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {

}
