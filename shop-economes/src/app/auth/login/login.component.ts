import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, LoginRequest, AuthResponse } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  // Thêm import này
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],  // Thêm HttpClientModule vào imports
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      emailOrPhone: ['', [Validators.required]],  // Kiểm tra trường email hoặc phone
      password: ['', Validators.required],  // Kiểm tra trường password
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData: LoginRequest = this.loginForm.value;
      this.authService.login(loginData).subscribe({
        next: (response: AuthResponse) => {
          // Lưu token vào localStorage
          if (response && response.data && response.data.token) {
            localStorage.setItem('token', response.data.token); // Lưu token vào localStorage
          }
          
          // Chuyển hướng sau khi đăng nhập thành công
          if (response.status === 200) {
            this.router.navigate(['/dashboard']);  // Điều hướng tới trang dashboard
          }
        },
        error: () => {
          this.errorMessage = 'Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.';  // Hiển thị lỗi khi đăng nhập thất bại
        }
      });
    }
  }
}
