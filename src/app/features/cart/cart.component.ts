import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore, CartItem } from '../../store/cart.store';
import {
  LucideMinus,
  LucidePlus,
  LucideShoppingBag,
  LucideShoppingCart,
  LucideTrash2,
  LucideAlertTriangle,
  LucideAlertCircle,
  LucideArrowRight,
} from '@lucide/angular';
import { RouterLink } from '@angular/router';

export type CartStoreApi = {
  cart: () => CartItem[];
  loading: () => boolean;
  totalItems: () => number;
  isEmpty: () => boolean;
  totalPrice: () => number;
  hasPriceChanges: () => boolean;
  loadCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  syncPrices: () => Promise<void>;
  clearCart: () => Promise<void>;
};

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideShoppingCart, // For the header
    LucideMinus, // For decrease
    LucidePlus, // For increase
    LucideTrash2, // For remove
    LucideShoppingBag, // For empty state
    LucideAlertTriangle,
    LucideAlertCircle,
    LucideArrowRight,
  ],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartStore = inject(CartStore) as CartStoreApi;

  ngOnInit() {
    this.cartStore.loadCart();
  }

  getProductStock(product: any, color?: string): number {
    if (!product.variants || product.variants.length === 0) return 0;
    if (color) {
      const variant = product.variants.find((v: any) => v.color.toLowerCase() === color.toLowerCase());
      return variant ? variant.stock : 0;
    }
    return product.variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0);
  }

  remove(id: string, color?: string) {
    this.cartStore.removeFromCart(id, color);
  }

  increase(id: string, color?: string) {
    this.cartStore.addToCart(id, 1, color);
  }

  decrease(id: string, quantity: number, color?: string) {
    if (quantity <= 1) {
      this.remove(id, color);
    } else {
      this.cartStore.addToCart(id, -1, color);
    }
  }

  clear() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartStore.clearCart();
    }
  }
}
