import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/services/auth.service'; // Đảm bảo đường dẫn đúng
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-modal',
  standalone: true,  // Đánh dấu là standalone component
  imports: [
    ReactiveFormsModule,  // Đảm bảo ReactiveFormsModule đã được import
    NgbModalModule,       // Cần ng-bootstrap modal module
    CommonModule         // CommonModule để sử dụng các phần tử như ngIf
  ],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent {
  activeTab: 'login' | 'register' = 'login';
  form: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      emailOrPhone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: [''],
      phone: [''],
      confirmPassword: ['']
    });

    this.updateValidators();
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.errorMessage = '';
    this.updateValidators();
  }

  private updateValidators() {
    const isLogin = this.activeTab === 'login';

    this.form.get('fullName')?.clearValidators();
    this.form.get('phone')?.clearValidators();
    this.form.get('confirmPassword')?.clearValidators();

    if (!isLogin) {
      this.form.get('fullName')?.setValidators([Validators.required]);
      this.form.get('phone')?.setValidators([Validators.required]);
      this.form.get('confirmPassword')?.setValidators([Validators.required, Validators.minLength(6)]);
    }

    this.form.get('fullName')?.updateValueAndValidity();
    this.form.get('phone')?.updateValueAndValidity();
    this.form.get('confirmPassword')?.updateValueAndValidity();
  }

  async onSubmit() {
    if (this.form.invalid) return;

    if (this.activeTab === 'register' && this.form.value.password !== this.form.value.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      if (this.activeTab === 'login') {
        await this.authService.login({
          emailOrPhone: this.form.value.emailOrPhone,
          password: this.form.value.password
        }).toPromise();
      } else {
        await this.authService.register({
          fullName: this.form.value.fullName,
          email: this.form.value.emailOrPhone,
          phone: this.form.value.phone,
          password: this.form.value.password
        }).toPromise();
      }

      this.activeModal.close();
      window.location.reload();
    } catch (err: any) {
      this.errorMessage = err.error?.message || 'An error occurred';
    } finally {
      this.isLoading = false;
    }
  }
}
