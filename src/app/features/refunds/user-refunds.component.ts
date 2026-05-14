import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared/services/api.service';
import { Refund, PaginatedResponse } from '../../shared/models/api-response-model';
import {
  LucideHistory,
  LucideInfo,
  LucideAlertCircle,
  LucideCheckCircle,
  LucideXCircle,
  LucideClock,
  LucideChevronLeft,
  LucideChevronRight,
} from '@lucide/angular';

@Component({
  selector: 'app-user-refunds',
  standalone: true,
  imports: [
    CommonModule,
    LucideHistory,
    LucideInfo,
    LucideAlertCircle,
    LucideCheckCircle,
    LucideXCircle,
    LucideClock,
    LucideChevronLeft,
    LucideChevronRight,
  ],
  templateUrl: './user-refunds.component.html',
})
export class UserRefundsComponent implements OnInit {
  refunds = signal<Refund[]>([]);
  isLoading = signal(false);

  // Pagination
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadMyRefunds();
  }

  loadMyRefunds(): void {
    this.isLoading.set(true);
    const params = {
      page: this.currentPage(),
      limit: 10
    };

    this.apiService.get<PaginatedResponse<Refund>>('/refund/my', { params }).subscribe({
      next: (res) => {
        this.refunds.set(res.data);
        this.totalPages.set(res.pagination.totalPages);
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
      this.loadMyRefunds();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-error';
      default:
        return 'badge-warning';
    }
  }
}
