import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Order, OrdersResponse } from '../../shared/models/api-response-model';
import {
  LucideCircleX,
  LucidePackage,
  LucideCalendar,
  LucideDollarSign,
  LucideMapPin,
  LucideTruck,
  LucideClock,
  LucideChevronDown,
  LucideShoppingBag,
  LucideRefreshCw,
  LucideArrowLeft,
  LucideArrowRight,
} from '@lucide/angular';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LucidePackage,
    LucideShoppingBag,
    LucideCalendar,
    LucideRefreshCw,
    LucideClock,
    LucideDollarSign,
    LucideTruck,
    LucideCircleX,
    LucideChevronDown,
    LucideMapPin,
    LucideArrowLeft,
    LucideArrowRight,
  ],
  templateUrl: './orders.component.html',
  styles: [],
})
export class OrdersComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly notificationService = inject(NotificationService);

  // Signals for state management
  orders = signal<Order[]>([]);
  isLoading = signal(false);
  expandedOrderId = signal<string | null>(null);
  
  // Refund Modal State
  isRefundModalOpen = signal(false);
  selectedOrderForRefund = signal<Order | null>(null);
  refundReason = signal('');

  // Pagination signals
  currentPage = signal(1);
  totalPages = signal(1);
  totalOrders = signal(0);
  limit = signal(10);

  // Status filter
  selectedStatus = signal<string>('all');

  // Computed values
  hasOrders = computed(() => this.orders().length > 0);
  showPagination = computed(() => !this.isLoading() && this.hasOrders() && this.totalPages() > 1);
  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1); // Separator
        pages.push(total);
      } else if (current >= total - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      }
    }
    return pages;
  });

  // Effect to reload when filters change
  private readonly filterEffect = effect(() => {
    // Trigger when page or status changes
    this.currentPage();
    this.selectedStatus();
    this.loadOrders();
  });

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);

    let url = `/orders/my?page=${this.currentPage()}&limit=${this.limit()}&order=desc`;
    if (this.selectedStatus() !== 'all') {
      url += `&status=${this.selectedStatus()}`;
    }

    this.apiService.get<OrdersResponse>(url).subscribe({
      next: (response) => {
        this.orders.set(response.data);
        this.totalPages.set(response.pagination.totalPages);
        this.totalOrders.set(response.pagination.totalResult);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading.set(false);
      },
    });
  }

  toggleOrder(orderId: string): void {
    this.expandedOrderId.set(this.expandedOrderId() === orderId ? null : orderId);
  }

  getStatusClass(status: string): string {
    const classes = {
      pending: 'badge-warning',
      paid: 'badge-info',
      shipped: 'badge-primary',
      delivered: 'badge-success',
      cancelled: 'badge-error',
    };
    return classes[status as keyof typeof classes] || 'badge-neutral';
  }

  getStatusIcon(status: string): string {
    const icons = {
      pending: 'clock',
      paid: 'dollarSign',
      shipped: 'truck',
      delivered: 'checkCircle',
      cancelled: 'xCircle',
    };
    return icons[status as keyof typeof icons] || 'package';
  }

  getStatusColor(status: string): string {
    const colors = {
      pending: 'text-warning',
      paid: 'text-info',
      shipped: 'text-primary',
      delivered: 'text-success',
      cancelled: 'text-error',
    };
    return colors[status as keyof typeof colors] || 'text-base-content';
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onStatusFilterChange(status: string): void {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  requestRefund(order: Order): void {
    this.selectedOrderForRefund.set(order);
    this.refundReason.set('');
    this.isRefundModalOpen.set(true);
  }

  closeRefundModal(): void {
    this.isRefundModalOpen.set(false);
    this.selectedOrderForRefund.set(null);
  }

  submitRefund(): void {
    const order = this.selectedOrderForRefund();
    const reason = this.refundReason();

    if (!order) return;
    
    if (!reason || reason.trim() === '') {
      this.notificationService.error('Please provide a reason for the refund');
      return;
    }

    this.apiService.post('/refund', { orderId: order._id, reason }).subscribe({
      next: () => {
        this.notificationService.success('Refund request submitted successfully');
        this.closeRefundModal();
        this.loadOrders();
      },
      error: (err) => {
        console.error('Refund error:', err);
        this.notificationService.error(err.error?.message || 'Failed to submit refund request');
      },
    });
  }
}
