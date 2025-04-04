import { Component } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthModalComponent } from '../../../auth/auth-modal/auth-modal.component';  // Đảm bảo đường dẫn đúng
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,  // Đánh dấu là standalone component
  imports: [
    CommonModule,  // Đảm bảo CommonModule được import
    NgbModalModule // Đảm bảo NgbModalModule được import
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private modalService: NgbModal) {}

  // Mở Auth Modal và chuyển sang tab đăng ký
  openSignUpModal() {
    console.log('Mở Modal');
    const modalRef = this.modalService.open(AuthModalComponent, { centered: true });
    modalRef.componentInstance.activeTab = 'register';  // Mở tab đăng ký
  }

  // Trong component cha
  openAuthModal() {
    console.log('🔥 Attempting to open modal...');
    
    const modalRef = this.modalService.open(AuthModalComponent, {
      // Thêm cấu hình tối ưu
      windowClass: 'force-show-modal', 
      backdropClass: 'force-show-backdrop',
      animation: true,
      keyboard: false,
      size: 'md'
    });
  
    // Debug chi tiết
    modalRef.shown.subscribe(() => {
      console.log('✅ Modal SHOULD be visible now');
      console.log('Modal element:', document.querySelector('.modal'));
    });
  }
}
