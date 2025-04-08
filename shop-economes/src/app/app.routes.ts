import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent as AdminDashboard } from './admin/dashboard/dashboard.component';
import { DashboardComponent as UserDashboard } from './user/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard'; // Guard để bảo vệ các route
import { RoleGuard } from './core/guards/role.guard'; // Thêm RoleGuard để kiểm tra quyền

export const routes: Routes = [
  // Route mặc định sẽ chuyển đến trang đăng nhập
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Route cho trang đăng nhập
  { path: 'login', component: LoginComponent },

  // Route cho dashboard của Admin (Chỉ Admin mới được phép truy cập)
  { 
    path: 'admin/dashboard', 
    component: AdminDashboard, 
    canActivate: [AuthGuard, RoleGuard], // Kết hợp cả AuthGuard và RoleGuard
    data: { 
      roles: ['ADMIN'] // Chỉ Admin mới được phép truy cập
    }
  },

  // Route cho dashboard của User (Chỉ User mới được phép truy cập)
  { 
    path: 'user/dashboard', 
    component: UserDashboard, 
    canActivate: [AuthGuard, RoleGuard], // Kết hợp cả AuthGuard và RoleGuard
    data: { 
      roles: ['CUSTOMER'] // Chỉ User mới được phép truy cập
    }
  },

  // Route fallback nếu không tìm thấy route nào
  { path: '**', redirectTo: 'login' }
];
