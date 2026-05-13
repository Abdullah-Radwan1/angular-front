import { Product } from './product.model';

export interface OrderItem {
  _id?: string; // MongoDB includes an ID for sub-documents in the items array
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string; // Use _id as the primary key from MongoDB
  user: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'; // Added 'delivered' if used
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// 💡 Pro-Tip: Create a wrapper for the Paginated Response
export interface OrdersResponse {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    totalResult: number;
    totalPages: number;
  };
}
