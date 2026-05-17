import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { Product, AddToCartRequest } from '../../shared/models/api-response-model';
import { AuthStore } from '../../store/auth.store';
import { CartStore } from '../../store/cart.store';
import { ProductCardComponent } from '../../shared/components/product-card/product.card.component';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductCardComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  selectedColor = signal<string | null>(null);
  isLoading = signal(false); // Used for the initial fetch
  isAdding = signal(false); // Used for the button state
  cartForm: FormGroup;

  // Modern inject pattern
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly notificationService = inject(NotificationService);
  readonly authStore = inject(AuthStore);
  readonly cartStore = inject(CartStore);

  constructor() {
    this.cartForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }
  getTotalStock(product: Product): number {
    if (!product.variants || product.variants.length === 0) {
      return 0;
    }

    return product.variants.reduce((total, variant) => total + variant.stock, 0);
  }
  ngOnInit(): void {
    // 1. MUST match the key in your app.routes.ts (e.g., path: 'products/:slug')
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      this.loadProduct(slug);
    } else {
      this.router.navigate(['/products']);
    }

    // 🔥 Watch for route changes to reload product (important for related products links)
    this.route.params.subscribe((params) => {
      if (params['slug']) {
        this.loadProduct(params['slug']);
      }
    });
  }

  private loadProduct(slug: string): void {
    this.isLoading.set(true);

    this.apiService.get<Product>(`/products/${slug}`).subscribe({
      next: (product) => {
        this.product.set(product);
        this.isLoading.set(false);

        // Set initial color
        const firstAvailable = product.variants?.find((v) => v.stock > 0);
        this.selectedColor.set(firstAvailable?.color ?? null);

        // Load related products
        if (product.slug) {
          this.loadRelatedProducts(product.slug);
        }
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading.set(false);
        this.router.navigate(['/products']);
      },
    });
  }

  private loadRelatedProducts(slug: string): void {
    this.apiService.get<Product[]>(`/products/related/${slug}`).subscribe({
      next: (products) => {
        this.relatedProducts.set(products);
      },
      error: (err) => {
        console.error('Error loading related products:', err);
      },
    });
  }

  selectColor(color: string): void {
    this.selectedColor.set(color);
    const variant = this.product()?.variants?.find((v) => v.color === color);
    const stock = variant ? variant.stock : 0;
    if (this.cartForm.value.quantity > stock) {
      this.cartForm.patchValue({ quantity: Math.max(1, stock) });
    }
  }

  getSelectedVariantStock(): number {
    const product = this.product();
    if (!product || !product.variants) return 0;
    const variant = product.variants.find((v) => v.color === this.selectedColor());
    return variant ? variant.stock : 0;
  }

  async addToCart(): Promise<void> {
    if (this.cartForm.invalid || !this.product()) return;

    const { quantity } = this.cartForm.value;
    const stock = this.getSelectedVariantStock();

    if (quantity > stock) {
      this.notificationService.error(`Only ${stock} items are available in stock for this variant.`);
      return;
    }

    this.isAdding.set(true);

    try {
      // We add a small artificial delay so the user can actually see the "Adding..." state.
      // This makes the UI feel more responsive to the action.
      await Promise.all([
        this.cartStore.addToCart(this.product()!, quantity),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      this.isAdding.set(false);
    }
  }
}
