import { Product } from './product.model';
import { User } from './user.model';

export interface OrderItem {
  _id?: string;
  productId: any; // Can be ID string or Product object if populated
  name: string;
  imageUrl: string;
  category: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string; // Use _id as the primary key from MongoDB
  user: User;
  items: OrderItem[];
  totalPrice: number;
  hasRefundRequest?: boolean;
  refundStatus?: 'none' | 'pending' | 'approved' | 'rejected';
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
