import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../../api/service/auth.service';
import { AuthResponse } from '../../../../../api/model/auth-response.interface';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  authForm!: FormGroup;
  isLoginMode = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.authForm = this.fb.group({
      emailOrPhone: ['', [Validators.required]],  // emailOrPhone thay vì email cho cả đăng nhập và đăng ký
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: [''],
      phone: [''],
      email: ['', [Validators.email]],  // email chỉ cần khi đăng ký
    });

    this.updateValidators();
  }

  updateValidators(): void {
    const fullNameControl = this.authForm.get('fullName') as FormControl;
    const phoneControl = this.authForm.get('phone') as FormControl;
    const emailControl = this.authForm.get('email') as FormControl;
    const emailOrPhoneControl = this.authForm.get('emailOrPhone') as FormControl;
    
    if (this.isLoginMode) {
      fullNameControl.clearValidators();
      phoneControl.clearValidators();
      emailControl.clearValidators();
      emailOrPhoneControl.setValidators([Validators.required]);  // Email or Phone is required for login
    } else {
      fullNameControl.setValidators([Validators.required]);
      phoneControl.setValidators([Validators.required]);
      emailControl.setValidators([Validators.required, Validators.email]);  // Email required for register
      emailOrPhoneControl.clearValidators(); // Không cần emailOrPhone khi đăng ký
    }

    // Update all control validity after changing validators
    fullNameControl.updateValueAndValidity();
    phoneControl.updateValueAndValidity();
    emailControl.updateValueAndValidity();
    emailOrPhoneControl.updateValueAndValidity();
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.authForm.reset();  // Đặt lại form khi chuyển đổi giữa đăng nhập và đăng ký
    this.updateValidators(); // Cập nhật lại validators khi chuyển đổi mode
  }

  onSubmit(): void {
    if (this.authForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';  // Xóa thông báo lỗi cũ

    const formValue = this.authForm.value;

    if (this.isLoginMode) {
      // Đăng nhập
      this.authService.login({
        emailOrPhone: formValue.emailOrPhone,
        password: formValue.password
      }).subscribe({
        next: (response) => {
          this.handleAuthSuccess(response);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      // Đăng ký
      this.authService.register({
        fullName: formValue.fullName,
        phone: formValue.phone,
        email: formValue.email,
        password: formValue.password
      }).subscribe({
        next: (response) => {
          this.handleRegisterSuccess(response);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

private handleAuthSuccess(response: AuthResponse): void {
  this.isLoading = false;
  
  // In ra response để kiểm tra chi tiết
  console.log('Response from API:', response);

  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token); // Lưu JWT token vào localStorage
    console.log('Token saved in localStorage:', localStorage.getItem('authToken')); // Kiểm tra token đã lưu chưa
    this.router.navigate(['/']).then(() => {
      console.log('Điều hướng thành công đến trang chủ');
    }).catch((error) => {
      console.log('Điều hướng thất bại:', error);
    });
  } else {
    this.errorMessage = 'Có lỗi xảy ra khi đăng nhập';
  }
}

  

  private handleRegisterSuccess(response: AuthResponse): void {
    this.isLoading = false;
    if (response.data.message) {
      alert(response.data.message); // Thông báo đăng ký thành công
      this.isLoginMode = true;
      this.updateValidators();  // Cập nhật lại validators sau khi đăng ký thành công
    } else {
      this.errorMessage = 'Có lỗi xảy ra khi đăng ký';
    }
  }

  private handleError(error: any): void {
    this.isLoading = false;
    // In chi tiết lỗi ra console để dễ kiểm tra
    console.error(error);
    // Xử lý thông báo lỗi
    this.errorMessage = error.error?.message || 'Có lỗi xảy ra, vui lòng thử lại';
  }
}
