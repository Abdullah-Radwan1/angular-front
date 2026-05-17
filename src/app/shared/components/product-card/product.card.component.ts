import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Product } from '../../models/api-response-model';
import { CartStore } from '../../../store/cart.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product.card.component.html',

  // ------------------------------------------------------
  // ONPUSH = better performance
  // BUT requires reactive patterns
  // Signals work perfectly with OnPush
  // ------------------------------------------------------
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent implements OnInit, OnChanges {
  @Input() product!: Product;

  // ------------------------------------------------------
  // INJECT STORE
  // ------------------------------------------------------
  readonly cartStore = inject(CartStore);

  // ------------------------------------------------------
  // SIGNALS
  // ------------------------------------------------------
  // Signals automatically notify Angular UI updates
  // even with OnPush strategy.
  // ------------------------------------------------------
  isAdding = signal(false);

  // ------------------------------------------------------
  // NORMAL STATE
  // ------------------------------------------------------
  imageLoaded = false;

  productName = '';
  productDescription = '';
  totalStock = 0;
  isInStock = false;

  // ------------------------------------------------------
  // INIT
  // ------------------------------------------------------
  ngOnInit(): void {
    this.calculateProduct();
  }

  // ------------------------------------------------------
  // HANDLE INPUT CHANGES
  // ------------------------------------------------------
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      this.calculateProduct();
    }
  }

  // ------------------------------------------------------
  // CALCULATE PRODUCT DATA
  // ------------------------------------------------------
  private calculateProduct(): void {
    if (!this.product) return;

    this.productName = this.product.name ?? '';

    this.productDescription = this.product.description ?? '';

    // Calculate total stock
    this.totalStock = this.product.stock ?? 0;

    // Check stock availability
    this.isInStock = this.totalStock > 0;
  }

  // ------------------------------------------------------
  // SELECT PRODUCT COLOR
  // ------------------------------------------------------


  // ------------------------------------------------------
  // ADD TO CART
  // ------------------------------------------------------
  async addToCart(): Promise<void> {
    // Prevent duplicate clicks
    if (this.isAdding()) return;

    // Prevent adding out-of-stock products
    if (!this.isInStock) return;

    console.log('In stock:', this.isInStock);

    // Start loading state
    this.isAdding.set(true);

    try {
      // ------------------------------------------------------
      // Optimistic cart update
      // ------------------------------------------------------
      // Your store method is NOT truly async,
      // so we do NOT await it.
      this.cartStore.addToCart(this.product, 1);

      // ------------------------------------------------------
      // Small UX delay
      // ------------------------------------------------------
      // Lets user visually notice the loader.
      await new Promise((resolve) => setTimeout(resolve, 600));
    } catch (err) {
      console.error('Add to cart failed:', err);
    } finally {
      // Stop loading state
      this.isAdding.set(false);

      console.log('isAdding:', this.isAdding());
    }
  }

  // ------------------------------------------------------
  // IMAGE LOADED
  // ------------------------------------------------------
  onImageLoad(): void {
    this.imageLoaded = true;
  }
}
