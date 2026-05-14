import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Refund, PaginatedResponse } from '../../../shared/models/api-response-model';

@Component({
  selector: 'app-admin-refunds',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-refunds.component.html',
  styles: [],
})
export class AdminRefundsComponent implements OnInit {
  refunds = signal<Refund[]>([]);
  isLoading = signal(false);

  // Pagination
  currentPage = signal(1);
  totalPages = signal(1);
  totalResult = signal(0);

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
    this.loadRefunds();
  }

  loadRefunds(): void {
    this.isLoading.set(true);
    const params = {
      page: this.currentPage(),
      limit: 10,
    };

    this.apiService.get<PaginatedResponse<Refund>>('/refund', { params }).subscribe({
      next: (res) => {
        this.refunds.set(res.data);
        this.totalPages.set(res.pagination.totalPages);
        this.totalResult.set(res.pagination.totalResult);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading refunds:', error);
        this.isLoading.set(false);
      },
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadRefunds();
    }
  }

  updateRefundStatus(refundId: string, status: Refund['status']): void {
    this.apiService.put(`/refund/${refundId}`, { status }).subscribe({
      next: () => {
        this.notificationService.success(`Refund ${status} successfully`);
        this.loadRefunds();
      },
      error: (error) => this.notificationService.error('Failed to update refund status'),
    });
  }
}
