import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { PaginatedResponse } from '../../../shared/models/api-response-model';

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-testimonials.component.html',
})
export class AdminTestimonialsComponent implements OnInit {
  testimonials = signal<any[]>([]);
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

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadTestimonials();
  }

  loadTestimonials(): void {
    this.isLoading.set(true);
    const params = {
      page: this.currentPage(),
      limit: 10
    };

    this.apiService.get<PaginatedResponse<any>>('/testimonials/all', { params }).subscribe({
      next: (res) => {
        this.testimonials.set(res.data);
        this.totalPages.set(res.pagination.totalPages);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  toggleApproval(testimonial: any): void {
    const endpoint = testimonial.isApproved ? `/testimonials/${testimonial._id}/hide` : `/testimonials/${testimonial._id}/approve`;
    
    this.apiService.put(endpoint, {}).subscribe({
      next: () => {
        this.notificationService.success(`Testimonial ${testimonial.isApproved ? 'hidden' : 'approved'} successfully`);
        this.loadTestimonials();
      },
      error: () => this.notificationService.error('Failed to update testimonial status')
    });
  }

  deleteTestimonial(id: string): void {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    this.apiService.delete(`/testimonials/${id}`).subscribe({
      next: () => {
        this.notificationService.success('Testimonial deleted');
        this.loadTestimonials();
      },
      error: () => this.notificationService.error('Failed to delete testimonial')
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadTestimonials();
    }
  }
}
