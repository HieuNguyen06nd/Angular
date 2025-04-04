import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../../../api/service/category.service';
import { Category } from '../../../../../api/model/category.model';
import { AuthComponent } from '../../auth/auth/auth.component';
import { User} from '../../../../../api/model/user.model';
import { UserService } from '../../../../../api/service/user.service';
@Component({
  selector: 'app-header',
  imports: [CommonModule, AuthComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderComponent implements OnInit {
  categories: Category[] = [];
  showAuthModal: boolean = false;
  currentUser: User | null = null;

  constructor(private categoryService: CategoryService, private userService: UserService) {}


  ngOnInit() {
    this.categoryService.getRootCategories().subscribe(response => {
      if (response.status === 200) {
        this.categories = response.data; // Gán dữ liệu từ API
      }
    });

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin người dùng:', err);
        // Nếu chưa đăng nhập, có thể currentUser vẫn null
      }
    });
  }

  openAuthModal(): void {
    this.showAuthModal = true;
  }

  closeAuthModal(): void {
    this.showAuthModal = false;
  }
}
