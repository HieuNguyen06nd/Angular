import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';
import { Category } from '../../../core/models/category.model';
import { Cart } from '../../../core/models/cart.model';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userName = '';
  categories: Category[] = [];
  cart: Cart | null = null;

  private authSub!: Subscription;
  private cartSub!: Subscription;
  private categorySub!: Subscription;
  private platformId : Object;

  constructor(
    private authService: AuthService,
    private router: Router,
    private categoryService: CategoryService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.platformId = platformId;
  }

  ngOnInit(): void {
    // 1) Subscribe trạng thái login và lấy profile
    this.authSub = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        this.authService.getUserProfile().subscribe({
          next: res => this.userName = res.data.fullName || 'User',
          error: err => console.error('Lỗi lấy profile:', err)
        });
      } else {
        this.userName = '';
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.cartSub = this.cartService.cart$.subscribe(cart => {
        this.cart = cart;
      });

      const userId = Number(localStorage.getItem('userId'));
      if (userId) {
        this.cartService.loadCart(userId).subscribe({
          error: err => console.error('Lỗi loadCart:', err)
        });
      }
    }

    // 4) Lấy danh mục và gán subscription để unsubscribe
    this.categorySub = this.categoryService.getRootCategories().subscribe({
      next: data => this.categories = data,
      error: err => console.error('Lỗi lấy danh mục:', err)
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.cartSub?.unsubscribe();
    this.categorySub?.unsubscribe();
  }

  onRemoveItem(itemId: number, event: MouseEvent): void {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;

    const userId = Number(localStorage.getItem('userId'));
    if (!userId) return;

    this.cartService.removeItem(userId, itemId).subscribe({
      error: err => console.error('Xóa thất bại:', err)
    });
  }

  logout(): void {
    this.authService.logout();
    // bạn có thể thêm cartSubject.next(null) ở đây nếu muốn clear cart khi logout
  }
}
