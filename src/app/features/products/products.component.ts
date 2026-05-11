import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { ApiService } from '../../shared/services/api.service';
import { ProductCardComponent } from '../../shared/components/product-card/product.card.component';
import { Product } from '../../shared/models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductCardComponent],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);

  // 🔥 NEW
  categories = signal<{ _id: string; name: string }[]>([]);
  sort = signal<string>('-createdAt');
  isLoading = signal(false);

  filterForm: FormGroup;

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
      pages.push(i);
    }

    return pages;
  });

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      size: [''],
      minPrice: [''],
      maxPrice: [''],
      search: [''],
    });

    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage.set(1);
      this.loadProducts();
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories(); // 🔥 NEW
  }

  // ==========================
  // 📦 LOAD PRODUCTS
  // ==========================
  private loadProducts(): void {
    this.isLoading.set(true);
    const formValue = this.filterForm.value;

    const params: any = {
      page: this.currentPage(),
      limit: 12,
      sort: this.sort(),
    };
    console.log(this.categories);
    if (formValue.category) params.category = formValue.category;
    if (formValue.search) params.search = formValue.search;
    if (formValue.minPrice) params.minPrice = formValue.minPrice;
    if (formValue.maxPrice) params.maxPrice = formValue.maxPrice;

    this.apiService.get<any>('/products', { params }).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.totalPages.set(res.pages);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading.set(false);
      },
    });
  }

  changeSort(newSort: string): void {
    this.sort.set(newSort);
    this.currentPage.set(1);
    this.loadProducts();
  }

  // ==========================
  // 📂 LOAD CATEGORIES
  // ==========================
  private loadCategories(): void {
    this.apiService.get<any>('/categories').subscribe({
      next: (res) => {
        // ✅ FIX: Access the 'categories' property inside the response object
        this.categories.set(res.categories);
      },
      error: (err) => console.error(err),
    });
  }

  // ==========================
  // 🔄 PAGINATION
  // ==========================
  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
  }
}
