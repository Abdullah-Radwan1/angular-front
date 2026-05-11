import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styles: [],
})
export class OrdersComponent implements OnInit {
  orders = signal<Order[]>([]);

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.apiService.get<Order[]>('/order/my').subscribe({
      next: (orders) => this.orders.set(orders),
      error: (error) => console.error('Error loading orders:', error),
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'paid':
        return 'badge-info';
      case 'shipped':
        return 'badge-primary';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  }
}
