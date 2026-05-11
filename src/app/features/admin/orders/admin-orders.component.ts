import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Order } from '../../../shared/models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.component.html',
  styles: [],
})
export class AdminOrdersComponent implements OnInit {
  orders = signal<Order[]>([]);

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.apiService.get<Order[]>('/order').subscribe({
      next: (orders) => this.orders.set(orders),
      error: (error) => console.error('Error loading orders:', error),
    });
  }

  updateOrderStatus(order: Order, status: Order['status']): void {
    this.apiService.put(`/order/${order._id || order.id}`, { status }).subscribe({
      next: () => {
        this.notificationService.success('Order status updated');
        this.loadOrders();
      },
      error: (error) => this.notificationService.error('Failed to update order status'),
    });
  }
}
