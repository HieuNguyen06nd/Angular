import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService, RegisterRequest } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr'; // Nếu bạn dùng toastr để thông báo
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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AuthDialogComponent {
  isLogin = true; // true: hiển thị form đăng nhập, false: hiển thị form đăng ký
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AuthDialogComponent>,
    private authService: AuthService,
    private toastr: ToastrService // Nếu bạn dùng toastr, có thể bỏ qua nếu không cần
  ) {
    // Form đăng nhập
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Form đăng ký
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  onSubmit() {
    if (this.isLogin) {
      // Xử lý đăng nhập nếu cần
      if (this.loginForm.valid) {
        console.log('Đăng nhập:', this.loginForm.value);
        // Gọi API đăng nhập ở đây nếu bạn có
      }
    } else {
      // Xử lý đăng ký
      if (this.signupForm.valid) {
        const registerData: RegisterRequest = this.signupForm.value;
        console.log('Register data:', registerData);
        // Gọi API đăng ký từ AuthService
        this.authService.register(registerData).subscribe({
          next: (res) => {
            console.log('Đăng ký thành công:', res);
            // Hiển thị thông báo thành công nếu muốn
            this.toastr.success('Đăng ký thành công', 'Thông báo');
            // Đóng popup sau khi đăng ký thành công
            this.dialogRef.close();
          },
          error: (err) => {
            console.error('Đăng ký thất bại:', err);
            // Hiển thị thông báo lỗi
            this.toastr.error(err?.error?.message || 'Đăng ký thất bại', 'Lỗi');
          }
        });
      } else {
        // Nếu form không hợp lệ, bạn có thể hiển thị thông báo lỗi
        this.toastr.error('Vui lòng điền đầy đủ thông tin hợp lệ', 'Lỗi');
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  // Các hàm đăng nhập Google/Facebook nếu có
  loginWithGoogle() {
    console.log('Đăng nhập với Google');
  }

  loginWithFacebook() {
    console.log('Đăng nhập với Facebook');
  }
}
