import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService, Category } from '../../services/category.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
// Import component popup đã tạo (đường dẫn tùy thuộc cấu trúc project của bạn)
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, MatDialogModule],
})
export class HeaderComponent implements OnInit {
  categories: Category[] = [];
  isLoggedIn$!: Observable<boolean>;
  userName$!: Observable<string>;

  private categoryService = inject(CategoryService);

  // Inject MatDialog để mở popup
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCategories();
      this.isLoggedIn$ = of(false);
  }

  loadCategories() {
    this.categoryService.getRootCategories().subscribe((response) => {
      this.categories = response.result;
    });
  }

  // Hàm mở popup đăng nhập/đăng ký
  openRegisterDialog() {
    this.dialog.open(AuthDialogComponent, {
      width: '400px',
    });
  }

  logout() {
    // Hàm logout của bạn
    console.log('Logout clicked');
  }
}
