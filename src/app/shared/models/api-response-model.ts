export interface PaginationInfo {
  page: number;
  limit: number;
  totalResult: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export * from './user.model';
export * from './product.model';
export * from './cart.model';
export * from './order.model';
export * from './refund.model';
export * from './auth.model';
export * from './testimonial.model';
