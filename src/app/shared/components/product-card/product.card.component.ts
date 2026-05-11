import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models';
import { CartStore } from '../../../store/cart.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product.card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent implements OnInit, OnChanges {
  @Input() product!: Product;

  cartStore = inject(CartStore);

  selectedColor: string | null = null;
  imageLoaded = false;
  isAdding = false;

  productName = '';
  productDescription = '';
  totalStock = 0;
  isInStock = false;

  ngOnInit(): void {
    this.calculateProduct();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      this.calculateProduct();
    }
  }

  private calculateProduct(): void {
    if (!this.product) return;

    this.productName = this.product.name ?? '';
    this.productDescription = this.product.description ?? '';

    this.totalStock = this.product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 0;

    this.isInStock = this.totalStock > 0;

    const firstAvailable = this.product.variants?.find((v) => v.stock > 0);
    this.selectedColor = firstAvailable?.color ?? null;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  async addToCart(): Promise<void> {
    console.log(this.isInStock);
    console.log(this.isAdding);

    this.isAdding = true;

    try {
      await this.cartStore.addToCart(this.product as any, 1);
    } catch (err) {
      console.error(err);
    } finally {
      this.isAdding = false;
    }
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }
}
