import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService, RegisterRequest } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class AuthDialogComponent {
  isLogin = true; // true: hiển thị form đăng nhập, false: hiển thị form đăng ký
  loginForm: FormGroup;
  signupForm: FormGroup;

  // Biến lưu thông báo inline
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AuthDialogComponent>,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    // Khởi tạo form đăng nhập
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Khởi tạo form đăng ký
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Hàm chuyển qua lại giữa form đăng nhập và đăng ký
  toggleForm() {
    this.isLogin = !this.isLogin;
    // Reset thông báo khi chuyển form
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Xử lý submit dựa trên form hiện tại
  onSubmit() {
    if (this.isLogin) {
      // --- Xử lý đăng nhập ---
      if (this.loginForm.valid) {
        const { identifier, password } = this.loginForm.value;
        // Gọi API đăng nhập với 1 đối tượng theo kiểu AuthRequest
        this.authService.login({ emailOrPhone: identifier, password: password, otp: '' }).subscribe({
          next: (res: any) => {
            console.log('Đăng nhập thành công:', res);
            this.toastr.success('Đăng nhập thành công', 'Thông báo');
            // Đóng popup sau khi đăng nhập thành công
            this.dialogRef.close();
          },
          error: (err: any) => {
            console.error('Đăng nhập thất bại:', err);
            this.errorMessage = err?.error?.message || 'Đăng nhập thất bại';
            this.toastr.error(this.errorMessage, 'Lỗi');
          },
        });
      } else {
        this.errorMessage = 'Vui lòng điền đầy đủ thông tin đăng nhập';
        this.toastr.error(this.errorMessage, 'Lỗi');
      }
    } else {
      // --- Xử lý đăng ký ---
      if (this.signupForm.valid) {
        const registerData: RegisterRequest = this.signupForm.value;
        this.authService.register(registerData).subscribe({
          next: (res: any) => {
            console.log('Đăng ký thành công:', res);
            this.toastr.success('Đăng ký thành công', 'Thông báo');
            this.successMessage = 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.';
            this.errorMessage = '';

            // TỰ CHUYỂN SANG FORM ĐĂNG NHẬP sau khi đăng ký thành công
            this.isLogin = true;
            // Điền sẵn email vào trường đăng nhập
            this.loginForm.patchValue({ identifier: registerData.email });
            // Reset form đăng ký
            this.signupForm.reset();
          },
          error: (err: any) => {
            console.error('Đăng ký thất bại:', err);
            this.errorMessage = err?.error?.message || 'Đăng ký thất bại';
            this.toastr.error(this.errorMessage, 'Lỗi');
          },
        });
      } else {
        this.errorMessage = 'Vui lòng điền đầy đủ thông tin hợp lệ';
        this.toastr.error(this.errorMessage, 'Lỗi');
      }
    }
  }

  // Đóng popup
  closeDialog() {
    this.dialogRef.close();
  }

  // Các hàm đăng nhập bằng Google/Facebook nếu cần
  loginWithGoogle() {
    console.log('Đăng nhập với Google');
  }

  loginWithFacebook() {
    console.log('Đăng nhập với Facebook');
  }
}
