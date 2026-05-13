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

    // We only send the shipping info and payment method.
    // The items are pulled from the DB on the backend.
    const orderData = {
      shippingAddress: this.checkoutForm.value,
      paymentMethod: this.checkoutForm.value.paymentMethod,
    };

    this.apiService.post('/orders', orderData).subscribe({
      next: (res: any) => {
        this.notificationService.success('Order placed successfully!');

        // Clear the local store since the DB cart is now empty
        this.cartStore.clearCart();

        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notificationService.error(error.error?.message || 'Failed to place order');
      },
    });
  }
}
