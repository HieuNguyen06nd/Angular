import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { SliderComponent } from '../../shared/slider/slider.component';
import { BrandComponent } from "../../shared/brand/brand.component";
import { BannersComponent } from "../../shared/banners/banners.component";
import { ProductTrendingComponent } from "../../shared/product-trending/product-trending.component";
import { ProductFeaturesComponent } from "../../shared/product-features/product-features.component";


@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent, SliderComponent, BrandComponent,
    BannersComponent, ProductTrendingComponent, ProductFeaturesComponent],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
