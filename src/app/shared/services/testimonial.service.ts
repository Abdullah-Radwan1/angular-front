import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL } from '../ENV';
import { TestimonialsResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
  private http = inject(HttpClient);
  private baseUrl = `${URL}/testimonials`;

  getApprovedTestimonials(page: number = 1, limit: number = 10): Observable<TestimonialsResponse> {
    return this.http.get<TestimonialsResponse>(`${this.baseUrl}?page=${page}&limit=${limit}`);
  }

  createTestimonial(data: { content: string; rating: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data, { withCredentials: true });
  }
}
