import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CartItem } from '../models/api-response-model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private api: ApiService) {}

  getCart() {
    return this.api.get<{ items: CartItem[] }>('/cart');
  }

  addToCart(productId: string, quantity: number, color?: string) {
    return this.api.post<{ items: CartItem[] }>('/cart/add', { productId, quantity, color });
  }

  removeFromCart(productId: string, color?: string) {
    const url = color ? `/cart/${productId}?color=${encodeURIComponent(color)}` : `/cart/${productId}`;
    return this.api.delete<{ items: CartItem[] }>(url);
  }

  syncPrices() {
    return this.api.put<{ items: CartItem[] }>('/cart/sync', {});
  }

  clearCart() {
    return this.api.delete<{ items: CartItem[] }>('/cart/clear');
  }

  mergeCart(items: any[]) {
    return this.api.post<{ items: CartItem[] }>('/cart/merge', { items });
  }
}
