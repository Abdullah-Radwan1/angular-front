import { Product } from './product.model';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id?: string;
  id?: string;
  user: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Refund {
  _id?: string;
  id?: string;
  order: string;
  user: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}
