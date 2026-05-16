import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-categories.component.html',
})
export class AdminCategoriesComponent implements OnInit {
  categories = signal<any[]>([]);
  isLoading = signal(false);
  categoryForm: FormGroup;
  editingId = signal<string | null>(null);

  mainCategories = computed(() => 
    this.categories().filter(c => !c.parentId)
  );

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      parentId: [null],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.apiService.get<any>('/categories').subscribe({
      next: (res) => {
        this.categories.set(res.categories || res.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  getSubcategories(parentId: string): any[] {
    return this.categories().filter(c => c.parentId === parentId);
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;

    const data = this.categoryForm.value;
    const id = this.editingId();

    const request$ = id 
      ? this.apiService.put(`/categories/${id}`, data)
      : this.apiService.post('/categories', data);

    request$.subscribe({
      next: () => {
        this.notificationService.success(`Category ${id ? 'updated' : 'created'} successfully`);
        this.categoryForm.reset({ name: '', parentId: null });
        this.editingId.set(null);
        this.loadCategories();
      },
      error: () => this.notificationService.error('Failed to save category')
    });
  }

  editCategory(category: any): void {
    this.editingId.set(category._id);
    this.subSelected = !!category.parentId;
    this.categoryForm.patchValue({
      name: category.name,
      parentId: category.parentId || null,
    });
    // Scroll to top or form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteCategory(id: string): void {
    if (!confirm('Are you sure you want to delete this category? This will also delete its subcategories.')) return;

    this.apiService.delete(`/categories/${id}`).subscribe({
      next: () => {
        this.notificationService.success('Category deleted');
        this.loadCategories();
      },
      error: () => this.notificationService.error('Failed to delete category')
    });
  }

  private subSelected = false;

  isSubSelected(): boolean {
    return this.subSelected;
  }

  setSubSelected(val: boolean): void {
    this.subSelected = val;
    if (val && !this.categoryForm.get('parentId')?.value && this.mainCategories().length > 0) {
      this.categoryForm.get('parentId')?.setValue(this.mainCategories()[0]._id);
    } else if (!val) {
      this.categoryForm.get('parentId')?.setValue(null);
    }
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.categoryForm.reset({ name: '', parentId: null });
    this.subSelected = false;
  }
}
