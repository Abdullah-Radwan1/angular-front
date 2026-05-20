import { Component, inject, signal, linkedSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL } from '../../../enviroment_variables/ENV';
import {
  LucideShoppingCart,
  LucideUsers,
  LucideDollarSign,
  LucidePackage,
  LucideCalendar,
  LucideRefreshCw,
  LucideTrendingUp,
} from '@lucide/angular';

interface OverallStats {
  totalSalesAmount: number;
  totalQuantitySold: number;
  totalOfPurchases: number;
}

interface TopProduct {
  _id: string;
  name: string;
  revenue: number;
  imageUrl: string;
  quantity: number;
}

interface TopClient {
  _id: string;
  name: string;
  totalSpent: number;
  totalOfPurchases: number;
  totalQuantity: number;
}

interface MonthlySale {
  _id: { year: number; month: number };
  totalRevenue: number;
  totalQuantity: number;
}

interface ReportData {
  overallStats: OverallStats[];
  topProducts: TopProduct[];
  topClient: TopClient[];
  monthlySales: MonthlySale[];
}

@Component({
  selector: 'app-sales-report',
  templateUrl: './admin-reports.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideTrendingUp,
    LucideShoppingCart,
    LucideUsers,
    LucideDollarSign,
    LucidePackage,
    LucideCalendar,
    LucideRefreshCw,
  ],
})
export class SalesReportComponent {
  private http = inject(HttpClient);

  // Filters & UI States
  startDate = signal('');
  endDate = signal('');
  loading = signal(false);
  error = signal('');
  message = signal('');

  // Core Data Stores
  stats = signal<OverallStats>({ totalSalesAmount: 0, totalQuantitySold: 0, totalOfPurchases: 0 });
  topProducts = signal<TopProduct[]>([]);
  topClients = signal<TopClient[]>([]);
  monthlySales = signal<MonthlySale[]>([]);

  // Linked Signals automatically derive and re-link layout constraints when base data modifies
  maxProductRevenue = linkedSignal(() => this.topProducts()[0]?.revenue || 1);
  maxClientSpent = linkedSignal(() => this.topClients()[0]?.totalSpent || 1);
  maxMonthlyRevenue = linkedSignal(() => this.monthlySales()[0]?.totalRevenue || 1);

  readonly MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  constructor() {
    // Initial data load on construction
    this.fetchReport();
  }

  fetchReport() {
    this.loading.set(true);
    this.error.set('');

    let params = new HttpParams();
    if (this.startDate()) params = params.set('startDate', this.startDate());
    if (this.endDate()) params = params.set('endDate', this.endDate());

    this.http
      .get<{
        message: string;
        data: ReportData[];
      }>(`${URL}/admin/report`, { params, withCredentials: true })
      .subscribe({
        next: (res) => {
          this.message.set(res.message);
          const rawData = res.data?.[0];

          if (!rawData) {
            this.stats.set({ totalSalesAmount: 0, totalQuantitySold: 0, totalOfPurchases: 0 });
            this.topProducts.set([]);
            this.topClients.set([]);
            this.monthlySales.set([]);
            this.loading.set(false);
            return;
          }

          this.stats.set(
            rawData.overallStats?.[0] ?? {
              totalSalesAmount: 0,
              totalQuantitySold: 0,
              totalOfPurchases: 0,
            },
          );
          this.topProducts.set(rawData.topProducts ?? []);
          this.topClients.set(rawData.topClient ?? []);
          this.monthlySales.set(rawData.monthlySales ?? []);

          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err?.error?.message || 'Failed to load report.');
          this.loading.set(false);
        },
      });
  }

  monthLabel(sale: MonthlySale): string {
    return `${this.MONTHS[sale._id.month - 1]} ${sale._id.year}`;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
