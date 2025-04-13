import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { SliderComponent } from '../shared/slider/slider.component';
import { BrandsComponent } from '../shared/brands/brands.component';
import { ProductsFeaturesComponent } from '../shared/products-features/products-features.component';
import { ProductsTrendingComponent } from '../shared/products-trending/products-trending.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent,
     FooterComponent, SliderComponent, BrandsComponent,
     ProductsFeaturesComponent, ProductsTrendingComponent],
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {
  isLoggedIn = false;
  userName = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.authService.getUserProfile().subscribe({
        next: (res) => {
          this.userName = res.data.fullName || 'User';
        },
        error: (err) => {
          console.error('Lỗi lấy thông tin người dùng:', err);
        }
      });
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }
}
