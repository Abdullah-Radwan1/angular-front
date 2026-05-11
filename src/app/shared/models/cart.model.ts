// 🔹 Product (abbreviated for use inside the cart)
export interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  stock: number;

  // 🔥 Important for the UI
  isLowStock?: boolean;
}

// ==========================
// 🛒 Cart
// ==========================

export interface CartItem {
  product: string | Product; // populated or just id
  quantity: number;

  // 🔥 Snapshot at the time of addition
  priceAtAdd: number;

  // 🔥 If the price changed
  isPriceChanged: boolean;
}

export interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];

  createdAt?: string;
  updatedAt?: any;
}

// ==========================
// ➕ Requests
// ==========================

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

// ==========================
// 🧠 Helpers (optional but very useful)
// ==========================

export type ProductRef = string | Product;

export const getProductId = (product: ProductRef): string =>
  typeof product === 'string' ? product : product._id;

export const isPopulatedProduct = (product: ProductRef): product is Product =>
  typeof product !== 'string';

// ==========================
// 🛍️ Order (for integration)
// ==========================

export interface OrderItem {
  product: string | Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';

  createdAt: string;
  updatedAt: string;
}

// ==========================
// 💰 Refund
// ==========================

export interface Refund {
  _id: string;
  order: string | Order;
  user: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';

  createdAt: string;
  updatedAt: string;
}

// ==========================
// 🔐 Auth
// ==========================

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';

  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
