import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Product } from '../../../shared/models';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-products.component.html',
  styles: [],
})
export class AdminProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  showForm = signal(false);
  editingProduct = signal<Product | null>(null);
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      colors: [[], Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      images: [[], Validators.required],
    });
  }

  private loadProducts(): void {
    this.apiService.get<Product[]>('/admin/products').subscribe({
      next: (products) => this.products.set(products),
      error: (error) => console.error('Error loading products:', error),
    });
  }

  openForm(product?: Product): void {
    this.showForm.set(true);
    if (product) {
      this.editingProduct.set(product);
      this.productForm.patchValue(product);
    } else {
      this.editingProduct.set(null);
      this.productForm.reset();
    }
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingProduct.set(null);
    this.productForm.reset();
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const productData = this.productForm.value;

    if (this.editingProduct()) {
      this.apiService.put(`/admin/products/${this.editingProduct()!._id}`, productData).subscribe({
        next: () => {
          this.notificationService.success('Product updated successfully');
          this.loadProducts();
          this.closeForm();
        },
        error: (error) => this.notificationService.error('Failed to update product'),
      });
    } else {
      this.apiService.post('/admin/products', productData).subscribe({
        next: () => {
          this.notificationService.success('Product created successfully');
          this.loadProducts();
          this.closeForm();
        },
        error: (error) => this.notificationService.error('Failed to create product'),
      });
    }
  }

  deleteProduct(product: Product): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.apiService.delete(`/admin/products/${product._id}`).subscribe({
        next: () => {
          this.notificationService.success('Product deleted successfully');
          this.loadProducts();
        },
        error: (error) => this.notificationService.error('Failed to delete product'),
      });
    }
  }

  toggleActive(product: Product): void {
    this.apiService
      .patch(`/admin/products/${product._id}`, { isDeleted: !product.isDeleted })
      .subscribe({
        next: () => {
          this.notificationService.success('Product status updated');
          this.loadProducts();
        },
        error: (error) => this.notificationService.error('Failed to update product status'),
      });
  }
}
