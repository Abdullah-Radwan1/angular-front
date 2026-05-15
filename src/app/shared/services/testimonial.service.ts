import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TestimonialsResponse } from '../models/api-response-model';

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
  constructor(private api: ApiService) {}

  getApprovedTestimonials(page: number = 1, limit: number = 10) {
    return this.api.get<TestimonialsResponse>('/testimonials', {
      params: { page, limit },
    });
  }

  createTestimonial(data: { content: string; rating: number }) {
    return this.api.post('/testimonials', data);
  }
}
