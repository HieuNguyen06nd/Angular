import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  imageUrl: string;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  
  isLoggedIn = false;
  userName = '';
  // Biến pageClass dùng để binding vào class của container
  pageClass = 'site';
  private routerSub: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/') {
        this.pageClass = 'site page-home';
      } else if (event.url.startsWith('/product')) {
        this.pageClass = 'site page-single';
      } else {
        this.pageClass = 'site'; // Class mặc định cho các route khác
      }
    });
  }
  ngOnDestroy() {
    this.routerSub.unsubscribe(); // Hủy đăng ký để tránh rò rỉ bộ nhớ
  }

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

  isCartOpen = false;

  // giả lập dữ liệu giỏ hàng
  cartItems: CartItem[] = [
    { id: 1, name: 'Dimmable ceiling light modern', price: 278.32, qty: 2, imageUrl: 'assets/img/light1.jpg' },
    { id: 2, name: 'Wooden table lamp',           price: 120.00, qty: 1, imageUrl: 'assets/img/lamp2.jpg' }
  ];

  isMiniCartOpen = false;


  // toggle khi click icon Cart
  toggleMiniCart() {
    this.isMiniCartOpen = !this.isMiniCartOpen;
  }

  // nếu cần đóng khi click ra ngoài hoặc hover out
  closeMiniCart() {
    this.isMiniCartOpen = false;
  }

  // tính subtotal
  get subtotal(): number {
    return this.cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  }


}
