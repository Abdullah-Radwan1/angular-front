import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Order, PaginatedResponse } from '../../../shared/models/api-response-model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.component.html',
  styles: [],
})
export class AdminOrdersComponent implements OnInit {
  orders = signal<Order[]>([]);

  // Pagination State
  currentPage = signal(1);
  totalPages = signal(1);

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
      pages.push(i);
    }
    return pages;
  });

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const params = {
      page: this.currentPage(),
    };

    this.apiService.get<PaginatedResponse<Order>>('/orders', { params }).subscribe({
      next: (res) => {
        this.orders.set(res.data);
        this.totalPages.set(res.pagination?.totalPages || 1);
      },
      error: (error) => console.error('Error loading orders:', error),
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadOrders();
    }
  }

  updateOrderStatus(order: Order, status: Order['status']): void {
    this.apiService.put(`/orders/${order._id}`, { status }).subscribe({
      next: () => {
        this.notificationService.success('Order status updated');
        this.loadOrders();
      },
      error: (error) => this.notificationService.error('Failed to update order status'),
    });
  }
}
