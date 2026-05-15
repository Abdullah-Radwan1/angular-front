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

  addToCart(productId: string, quantity: number) {
    return this.api.post<{ items: CartItem[] }>('/cart/add', { productId, quantity });
  }

  removeFromCart(productId: string) {
    return this.api.delete<{ items: CartItem[] }>(`/cart/${productId}`);
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
