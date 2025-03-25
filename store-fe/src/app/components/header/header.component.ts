import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService, Category } from '../../services/category.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs'; // ✅ Thay vì BehaviorSubject, dùng Observable

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, MatDialogModule],
})
export class HeaderComponent implements OnInit {
  categories: Category[] = [];
  isLoggedIn$: Observable<boolean>; // ✅ Sửa kiểu dữ liệu thành Observable
  userName$: Observable<string | null>; // ✅ Sửa kiểu dữ liệu thành Observable

  private categoryService = inject(CategoryService);

  constructor(private dialog: MatDialog, private authService: AuthService) {
    // ✅ Gán giá trị trực tiếp từ AuthService
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.userName$ = this.authService.userName$;
  }

  ngOnInit(): void {
    this.loadCategories();

    this.loadCategories();

    this.isLoggedIn$.subscribe((loggedIn) => {
      console.log('🟢 isLoggedIn từ AuthService:', loggedIn);
    });
  
    this.userName$.subscribe((name) => {
      console.log('🟢 userName từ AuthService:', name);
    });
  }

  loadCategories() {
    this.categoryService.getRootCategories().subscribe((response) => {
      this.categories = response.result;
    });
  }

  openRegisterDialog() {
    this.dialog.open(AuthDialogComponent, { width: '400px' });
  }

  logout() {
    this.authService.logout();
  }
}
