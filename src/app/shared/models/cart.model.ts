import { Product } from './product.model';

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

  createdAt?: string | Date;
  updatedAt?: string | Date;
}

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
