import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-dashboard',
  standalone: true,  // Đặt thuộc tính này để component hoạt động độc lập
  imports: [CommonModule],  // Đảm bảo thêm các module cần thiết vào đây
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
