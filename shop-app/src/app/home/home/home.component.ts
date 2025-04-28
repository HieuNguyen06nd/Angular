import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cart } from '../../core/models/cart.model';
import { CartService } from '../../core/services/cart.service';
import { isPlatformBrowser } from '@angular/common';


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
  private cartSub!: Subscription;
  cart: Cart | null = null;
  private platformId: Object;

  constructor(private authService: AuthService, 
    private cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object) 
    {
    this.platformId = platformId;
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
    this.routerSub?.unsubscribe();
    this.cartSub?.unsubscribe();
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

     // gọi cart ở đây
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

    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.authService.getUserProfile().subscribe({
        next: r => this.userName = r.data.fullName || 'User',
        error: err => console.error('Lỗi profile:', err)
      });
    }
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

  navigateToLogin() {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }

  isCartOpen = false;

  

  isMiniCartOpen = false;


  // toggle khi click icon Cart
  toggleMiniCart() {
    this.isMiniCartOpen = !this.isMiniCartOpen;
  }

  // nếu cần đóng khi click ra ngoài hoặc hover out
  closeMiniCart() {
    this.isMiniCartOpen = false;
  }

}
