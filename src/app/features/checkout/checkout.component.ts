import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { CartStore } from '../../store/cart.store';
import { AddressService, Address } from '../../shared/services/address.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styles: [],
})
export class CheckoutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly addressService = inject(AddressService);
  readonly cartStore = inject(CartStore);

  checkoutForm: FormGroup;
  isLoading = signal(false);
  savedAddresses = signal<Address[]>([]);
  selectedAddressId = signal<string | null>(null);

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

  ngOnInit(): void {
    this.loadSavedAddresses();
  }

  loadSavedAddresses(): void {
    this.addressService.getAddresses().subscribe({
      next: (res) => {
        const addresses = res.data?.addresses || [];
        this.savedAddresses.set(addresses);
        
        // Find default or first address and auto-fill
        if (addresses.length > 0) {
          const defaultAddress = addresses.find((addr: Address) => addr.isDefault) || addresses[0];
          this.selectAddress(defaultAddress);
        }
      },
      error: (err) => console.error('Failed to load saved addresses:', err),
    });
  }

  selectAddress(address: Address): void {
    if (address._id) {
      this.selectedAddressId.set(address._id);
    }
    this.checkoutForm.patchValue({
      street: address.street,
      city: address.city,
      state: address.state || '',
      zipCode: address.zipCode || '',
      country: address.country,
    });
  }

  useCustomAddress(): void {
    this.selectedAddressId.set(null);
    this.checkoutForm.patchValue({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);

    // We send the shipping address object and payment method.
    const orderData = {
      shippingAddress: {
        street: this.checkoutForm.value.street,
        city: this.checkoutForm.value.city,
        state: this.checkoutForm.value.state,
        zipCode: this.checkoutForm.value.zipCode,
        country: this.checkoutForm.value.country,
      },
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

