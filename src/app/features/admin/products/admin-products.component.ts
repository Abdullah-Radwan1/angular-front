import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Product, PaginatedResponse } from '../../../shared/models/api-response-model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-products.component.html',
})
export class AdminProductsComponent implements OnInit {
  // Data State
  products = signal<Product[]>([]);
  categories = signal<any[]>([]);
  mainCategories = signal<any[]>([]);
  subCategories = signal<any[]>([]);

  // UI State
  showForm = signal(false);
  editingProduct = signal<Product | null>(null);
  productForm: FormGroup;
  selectedFile: File | null = null;

  // Search, Filter, & Sort State
  searchQuery = signal('');
  statusFilter = signal('all'); // options: 'all', 'active', 'archived'
  categoryFilter = signal('');
  subcategoryFilter = signal('');
  filterSubCategories = signal<any[]>([]);
  sortOption = signal('-createdAt');

  // Pagination State
  currentPage = signal(1);
  totalPages = signal(1);

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      subcategory: [''],
      colors: ['', Validators.required], // Handled as string in UI, array in DB
      stock: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
    });
  }

  // --- Core Logic: Fetching Data ---
  loadProducts(): void {
    const params: any = {
      search: this.searchQuery(),
      sort: this.sortOption(),
      page: this.currentPage(),
    };

    if (this.statusFilter() !== 'all') {
      params.status = this.statusFilter();
    }
    if (this.categoryFilter()) {
      params.category = this.categoryFilter();
    }
    if (this.subcategoryFilter()) {
      params.subcategory = this.subcategoryFilter();
    }

    this.apiService.get<PaginatedResponse<Product>>('/admin/products', { params }).subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.totalPages.set(res.pagination?.totalPages || 1);
      },
      error: () => this.notificationService.error('Failed to load products'),
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadProducts();
    }
  }

  loadCategories(): void {
    this.apiService.get<any>('/categories').subscribe({
      next: (res) => {
        const allCats = res.categories || res.data || [];
        this.categories.set(allCats);
        this.mainCategories.set(allCats.filter((c: any) => !c.parentId));
      },
      error: () => this.notificationService.error('Failed to load categories'),
    });
  }

  onCategoryChange(event: Event): void {
    const categoryId = (event.target as HTMLSelectElement).value;
    this.updateSubcategories(categoryId);
  }

  updateSubcategories(categoryId: string): void {
    const subCats = this.categories().filter((c: any) => c.parentId === categoryId);
    this.subCategories.set(subCats);
    if (!subCats.some((c) => c._id === this.productForm.get('subcategory')?.value)) {
        this.productForm.get('subcategory')?.setValue('');
    }
  }

  onFilterCategory(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.categoryFilter.set(value);
    this.subcategoryFilter.set('');
    this.filterSubCategories.set(this.categories().filter((c: any) => c.parentId === value));
    this.currentPage.set(1);
    this.loadProducts();
  }

  onFilterSubcategory(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.subcategoryFilter.set(value);
    this.currentPage.set(1);
    this.loadProducts();
  }

  // --- Event Handlers for Filters ---
  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onFilterStatus(status: string): void {
    this.statusFilter.set(status);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sortOption.set(value);
    this.currentPage.set(1);
    this.loadProducts();
  }

  // --- Form Actions ---
  openForm(product?: Product): void {
    this.showForm.set(true);
    if (product) {
      this.editingProduct.set(product);
      
      const categoryId = (product.category as any)?._id || product.category;
      this.updateSubcategories(categoryId);

      // Join colors for display and get total stock
      const displayData = {
        ...product,
        category: categoryId,
        subcategory: (product.subcategory as any)?._id || product.subcategory || '',
        colors: product.variants?.map((v) => v.color).join(', ') || '',
        stock: this.getTotalStock(product),
      };
      this.productForm.patchValue(displayData);
    } else {
      this.editingProduct.set(null);
      this.productForm.reset({ price: 0, stock: 0, isActive: true, subcategory: '' });
      this.subCategories.set([]);
      this.selectedFile = null;
    }
  }

  getTotalStock(product: Product): number {
    return product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingProduct.set(null);
    this.productForm.reset();
    this.selectedFile = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const formData = new FormData();
    const rawData = this.productForm.value;

    // Extract colors and stock to build variants
    const colorString = rawData['colors'] || '';
    const colorArray =
      typeof colorString === 'string'
        ? colorString
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s !== '')
        : [];

    const stock = Number(rawData['stock']);

    const variants =
      colorArray.length > 0
        ? colorArray.map((color) => ({ color, stock }))
        : [{ color: 'default', stock }];

    // Process data before appending to FormData
    Object.keys(rawData).forEach((key) => {
      if (key === 'colors' || key === 'stock') return; // Handled by variants

      let value = rawData[key];
      if (key === 'subcategory' && !value) return; // don't append empty subcategory

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    formData.append('variants', JSON.stringify(variants));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const isEditing = !!this.editingProduct();
    const endpoint = isEditing
      ? `/admin/products/${this.editingProduct()!._id}`
      : '/admin/products';

    const request$ = isEditing
      ? this.apiService.putFormData(endpoint, formData)
      : this.apiService.postFormData(endpoint, formData);

    request$.subscribe({
      next: (res: any) => {
        const updatedProduct = res.data || res;

        if (isEditing) {
          this.products.update((products) =>
            products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)),
          );

          this.notificationService.success('Product updated successfully');
        } else {
          this.products.update((products) => [updatedProduct, ...products]);

          this.notificationService.success('Product created successfully');
        }

        this.closeForm();
      },

      error: () => this.notificationService.error('Action failed'),
    });
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to permanently delete ${product.name}?`)) {
      this.apiService.delete(`/admin/products/${product._id}`).subscribe({
        next: () => {
          this.products.update((products) => products.filter((p) => p._id !== product._id));

          this.notificationService.success('Product deleted successfully');
        },

        error: () => this.notificationService.error('Failed to delete product'),
      });
    }
  }

  toggleActive(product: Product): void {
    const newStatus = !product.isActive;

    this.apiService
      .put(`/admin/products/${product._id}`, {
        isActive: newStatus,
      })
      .subscribe({
        next: () => {
          this.products.update((products) =>
            products.map((p) => (p._id === product._id ? { ...p, isActive: newStatus } : p)),
          );

          this.notificationService.success(`Product ${newStatus ? 'activated' : 'archived'}`);
        },

        error: () => this.notificationService.error('Status update failed'),
      });
  }
}
