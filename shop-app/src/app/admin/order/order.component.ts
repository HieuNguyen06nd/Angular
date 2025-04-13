import { Component } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { OrderResponse } from '../../core/models/order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order',
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {

  orders: OrderResponse[] = [];
  isLoading = true;
  showOrderDetail = false;
  selectedOrder: OrderResponse | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe({
      next: (response) => {
        // response.data chứa mảng OrderResponse
        this.orders = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy đơn hàng:', err);
        this.isLoading = false;
      }
    });
  }

  viewOrderDetail(order: OrderResponse) {
    this.selectedOrder = order;
    this.showOrderDetail = true;
  }

  closeDetail() {
    this.showOrderDetail = false;
    this.selectedOrder = null;
  }
}
