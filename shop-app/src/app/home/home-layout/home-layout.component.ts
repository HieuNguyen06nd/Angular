import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from '../shared/slider/slider.component';
import { BrandsComponent } from '../shared/brands/brands.component';
import { ProductsFeaturesComponent } from '../shared/products-features/products-features.component';
import { ProductsTrendingComponent } from '../shared/products-trending/products-trending.component';

@Component({
  selector: 'app-home-layout',
  imports: [CommonModule, SliderComponent, BrandsComponent,
    ProductsFeaturesComponent, ProductsTrendingComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.css'
})
export class HomeLayoutComponent {

}
