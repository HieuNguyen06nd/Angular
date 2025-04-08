import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    const requiredRole = next.data['role'];  // Role yêu cầu từ route
    const userRole = this.authService.getRoleFromToken();

    if (userRole && userRole === requiredRole) {
      return true;  // Cho phép truy cập nếu role phù hợp
    }

    // Nếu role không hợp lệ hoặc không có quyền, chuyển hướng tới trang đăng nhập
    this.router.navigate(['/login']);
    return false;
  }
}
