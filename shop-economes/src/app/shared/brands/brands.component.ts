import { Component } from '@angular/core';
import { Brand } from '../../core/models/brand.model';
import { BrandService } from '../../core/services/brand.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brands',
  imports: [CommonModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent {
  brands: Brand[] = [];

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.brandService.getAllBrands().subscribe((brands) => {
      this.brands = brands;
    });
  }
}
