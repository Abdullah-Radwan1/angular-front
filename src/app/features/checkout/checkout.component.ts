import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styles: [],
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  readonly cartStore = inject(CartStore);

  checkoutForm: FormGroup;
  isLoading = signal(false);

  constructor() {
    this.checkoutForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
      paymentMethod: ['cod', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);

    // The backend endpoint is /v1/orders
    this.apiService.post('/orders', {}).subscribe({
      next: (res: any) => {
        this.notificationService.success('Order placed successfully!');
        this.cartStore.clearCart(); // Manually clear frontend cart too
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        console.error(error);
        this.notificationService.error(error.error?.message || 'Failed to place order');
        this.isLoading.set(false);
      },
    });
  }
}
