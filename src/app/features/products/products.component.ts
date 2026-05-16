import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from '../../shared/services/api.service';
import { ProductCardComponent } from '../../shared/components/product-card/product.card.component';
import { Product, PaginatedResponse } from '../../shared/models/api-response-model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductCardComponent],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<{ _id: string; name: string; parentId?: string }[]>([]);
  mainCategories = signal<{ _id: string; name: string; parentId?: string }[]>([]);
  subCategories = signal<{ _id: string; name: string; parentId?: string }[]>([]);

  // UI State
  isLoading = signal(false);
  filterForm: FormGroup;

  // Pagination & Sort State
  currentPage = signal(1);
  totalPages = signal(1);
  sort = signal<string>('-createdAt');

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
      subcategory: [''],
      minPrice: [''],
      maxPrice: [''],
      search: [''],
    });

    this.filterForm.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.currentPage.set(1);
      this.loadProducts();
    });

    this.filterForm.get('category')?.valueChanges.subscribe(() => {
      this.onCategoryChange();
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    const formValue = this.filterForm.value;

    const params: any = {
      page: this.currentPage(),
      limit: 12,
      sort: this.sort(),
    };

    if (formValue.category) params.category = formValue.category;
    if (formValue.subcategory) params.subcategory = formValue.subcategory;
    if (formValue.search) params.search = formValue.search;
    if (formValue.minPrice) params.minPrice = formValue.minPrice;
    if (formValue.maxPrice) params.maxPrice = formValue.maxPrice;

    this.apiService.get<PaginatedResponse<Product>>('/products', { params }).subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.totalPages.set(res.pagination?.totalPages || 1);
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

  loadCategories(): void {
    this.apiService.get<any>('/categories').subscribe({
      next: (res) => {
        const allCats = res.categories || res.data || [];
        this.categories.set(allCats);
        this.mainCategories.set(allCats.filter((c: any) => !c.parentId));
      },
      error: (err) => console.error(err),
    });
  }

  onCategoryChange(): void {
    const categoryId = this.filterForm.get('category')?.value;
    const subCats = this.categories().filter((c: any) => c.parentId === categoryId);
    this.subCategories.set(subCats);
    if (!subCats.some((c) => c._id === this.filterForm.get('subcategory')?.value)) {
        this.filterForm.get('subcategory')?.setValue('');
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadProducts();
    }
  }
}
