import { User } from './user.model';

export interface Testimonial {
  _id: string;
  user: User;
  content: string;
  rating: number;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialsResponse {
  data: Testimonial[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
