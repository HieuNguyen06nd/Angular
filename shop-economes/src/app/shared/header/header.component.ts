import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userName = '';
  categories: Category[] = []; // <-- Thêm biến này để hiển thị

  constructor(
    private authService: AuthService,
    private router: Router,
    private categoryService: CategoryService // <-- Inject service
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;

      if (status) {
        this.authService.getUserProfile().subscribe({
          next: (res) => {
            this.userName = res.data.fullName || 'User';
          },
          error: (err) => {
            console.error('Lỗi lấy thông tin người dùng:', err);
          }
        });
      } else {
        this.userName = '';
      }
    });

    // Gọi API danh mục
    this.categoryService.getRootCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Lỗi lấy danh mục:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToLogin(): void {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }
}
