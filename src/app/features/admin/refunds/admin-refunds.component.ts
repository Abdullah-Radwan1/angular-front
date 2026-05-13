import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Refund } from '../../../shared/models';

@Component({
  selector: 'app-admin-refunds',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-refunds.component.html',
  styles: [],
})
export class AdminRefundsComponent implements OnInit {
  refunds = signal<Refund[]>([]);

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadRefunds();
  }

  private loadRefunds(): void {
    this.apiService.get<Refund[]>('/refund').subscribe({
      next: (refunds) => this.refunds.set(refunds),
      error: (error) => console.error('Error loading refunds:', error),
    });
  }

  updateRefundStatus(refund: Refund, status: Refund['status']): void {
    this.apiService.put(`/refund/${refund._id || refund.id}`, { status }).subscribe({
      next: () => {
        this.notificationService.success('Refund status updated');
        this.loadRefunds();
      },
      error: (error) => this.notificationService.error('Failed to update refund status'),
    });
  }
}
