import { Order } from './order.model';
import { User } from './user.model';

export interface Refund {
  _id?: string;
  id?: string;
  order: Order;
  user: User;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
