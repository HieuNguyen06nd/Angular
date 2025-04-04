import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../../../../api/service/brand.service';
import { Brand } from '../../../../../api/model/brand.model';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-brand',
  imports: [CommonModule],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss'
})
export class BrandComponent implements OnInit {
  brands: Brand[] = [];

  constructor(private brandService: BrandService) {}
  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (response) => {
        this.brands = response.data;
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách thương hiệu:', err);
      }
    });
  }
}
