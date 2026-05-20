import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface ReportOverallStats {
  totalSalesAmount: number;
  totalQuantitySold: number;
  totalOfPurchases: number;
}

export interface ReportTopProduct {
  _id: string;
  name: string;
  revenue: number;
  imageUrl: string;
  quantity: number;
}

export interface ReportTopClient {
  name: string;
  totalSpent: number;
  totalOfPurchases: number;
  totalQuantity: number;
}

export interface ReportMonthlySales {
  _id: {
    year: number;
    month: number;
  };
  totalRevenue: number;
  totalQuantity: number;
}

export interface ReportData {
  overallStats: ReportOverallStats[];
  topProducts: ReportTopProduct[];
  topClient: ReportTopClient[];
  monthlySales: ReportMonthlySales[];
}

export interface ReportResponse {
  message: string;
  data: ReportData[];
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private api: ApiService) {}

  getReport(params?: { startDate?: string; endDate?: string }): Observable<ReportResponse> {
    return this.api.get<ReportResponse>('/admin/report', { params });
  }
}
