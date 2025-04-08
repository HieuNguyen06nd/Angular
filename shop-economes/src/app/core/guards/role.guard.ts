import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';  // Đảm bảo bạn import đúng AuthService

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = next.data['roles'];  // Các role yêu cầu từ route
    const userRole = this.authService.getRoleFromToken();  // Lấy role từ token

    if (roles.includes(userRole)) {
      return true;  // Nếu role hợp lệ, cho phép truy cập
    } else {
      this.router.navigate(['/login']);  // Nếu không, chuyển hướng tới trang login
      return false;
    }
  }
}
