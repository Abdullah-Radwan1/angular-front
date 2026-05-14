import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reports.component.html',
})
export class AdminReportsComponent implements OnInit {
  reportData = signal<any>(null);
  isLoading = signal(false);

  startDate = signal('');
  endDate = signal('');

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchReport();
  }

  fetchReport(): void {
    this.isLoading.set(true);
    const params: any = {};
    if (this.startDate()) params.startDate = this.startDate();
    if (this.endDate()) params.endDate = this.endDate();

    this.apiService.get<any>('/admin/revenue', { params }).subscribe({
      next: (res) => {
        this.reportData.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(value);
  }
}
