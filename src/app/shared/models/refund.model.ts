import { Order } from './order.model';

export interface Refund {
  _id?: string;
  id?: string;
  order: string | Order;
  user: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
