import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { Product } from '../../shared/models';
import { AddToCartRequest } from '../../shared/models/cart.model';
import { AuthStore } from '../../store/auth.store';
import { CartStore } from '../../store/cart.store';
import { ProductCardComponent } from '../../shared/components/product-card/product.card.component';

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
        if (product.category) {
          const categoryId =
            typeof product.category === 'string' ? product.category : (product.category as any)._id;
          this.loadRelatedProducts(categoryId, product._id);
        }
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading.set(false);
        this.router.navigate(['/products']);
      },
    });
  }

  private loadRelatedProducts(categoryId: string, excludeId: string): void {
    this.apiService.get<any>(`/products?category=${categoryId}&limit=5`).subscribe({
      next: (res) => {
        const filtered = (res.products || []).filter((p: Product) => p._id !== excludeId);
        this.relatedProducts.set(filtered.slice(0, 4));
      },
    });
  }

  selectColor(color: string): void {
    this.selectedColor.set(color);
  }

  addToCart(): void {
    if (this.cartForm.invalid || !this.product()) return;

    this.isAdding.set(true);
    const { quantity } = this.cartForm.value;

    // Use your store logic
    this.cartStore.addToCart(this.product()!, quantity);

    this.isAdding.set(false);
  }
}
