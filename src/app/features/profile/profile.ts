import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../store/auth.store';
import { NotificationService } from '../../shared/services/notification.service';
import {
  LucideSparkles,
  LucideShieldCheck,
  LucideLeaf,
  LucideUserCheck,
  LucideTruck,
  LucideHeart,
  LucideRotateCcw,
  LucidePackage,
  LucideHeadphones,
  LucideArrowRight,
  LucideDynamicIcon,
  LucideLock,
  LucideKeyRound,
  LucideMapPin,
  LucidePlus,
  LucideTrash2,
  LucideCheck,
  LucidePencil,
} from '@lucide/angular';
import { AddressService, Address } from '../../shared/services/address.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    LucideDynamicIcon,
    CommonModule,
    ReactiveFormsModule,
    LucideShieldCheck,
    LucideLock,
    LucideKeyRound,
    LucideMapPin,
    LucideTrash2,
    LucideCheck,
    LucidePencil,
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class ProfileComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private addressService = inject(AddressService);
  protected readonly LucidePlus = LucidePlus;
  protected readonly LucideRotateCcw = LucideRotateCcw;
  addresses = signal<Address[]>([]);
  addressForm: FormGroup;
  showAddressForm = signal(false);
  editingAddressId = signal<string | null>(null);
  loading = signal(false);

  passwordForm: FormGroup;
  showPasswordForm = signal(false);

  constructor() {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );

    this.addressForm = this.fb.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: [''],
      zipCode: [''],
      country: ['', [Validators.required]],
      phone: [''],
      isDefault: [false],
    });
  }
  ngOnInit(): void {
    // Refresh user data on profile page visit
    this.authStore.loadCurrentUser();
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.addressService.getAddresses().subscribe({
      next: (res) => {
        this.addresses.set(res.data.addresses);
      },
      error: (err) => {
        console.error('Failed to load addresses', err);
      },
    });
  }

  toggleAddressForm(address?: Address): void {
    this.showAddressForm.update((v) => !v);
    if (this.showAddressForm()) {
      if (address) {
        this.editingAddressId.set(address._id!);
        this.addressForm.patchValue(address);
      } else {
        this.editingAddressId.set(null);
        this.addressForm.reset({ isDefault: this.addresses().length === 0 });
      }
    } else {
      this.addressForm.reset();
      this.editingAddressId.set(null);
    }
  }

  onSubmitAddress(): void {
    if (this.addressForm.valid) {
      this.loading.set(true);
      const addressData = this.addressForm.value;

      const request = this.editingAddressId()
        ? this.addressService.updateAddress(this.editingAddressId()!, addressData)
        : this.addressService.addAddress(addressData);

      request.subscribe({
        next: () => {
          this.notificationService.success(
            `Address ${this.editingAddressId() ? 'updated' : 'added'} successfully`,
          );
          this.loadAddresses();
          this.toggleAddressForm();
          this.loading.set(false);
        },
        error: (err) => {
          this.notificationService.error(err?.error?.message || 'Failed to save address');
          this.loading.set(false);
        },
      });
    }
  }

  onDeleteAddress(id: string): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.addressService.deleteAddress(id).subscribe({
        next: () => {
          this.notificationService.success('Address deleted successfully');
          this.loadAddresses();
        },
        error: (err) => {
          this.notificationService.error(err?.error?.message || 'Failed to delete address');
        },
      });
    }
  }

  onSetDefault(id: string): void {
    this.addressService.setDefaultAddress(id).subscribe({
      next: () => {
        this.notificationService.success('Default address updated');
        this.loadAddresses();
      },
      error: (err) => {
        this.notificationService.error(err?.error?.message || 'Failed to set default address');
      },
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  togglePasswordForm(): void {
    this.showPasswordForm.update((v) => !v);
    if (!this.showPasswordForm()) {
      this.passwordForm.reset();
    }
  }

  onSubmitPassword(): void {
    if (this.passwordForm.valid) {
      this.authStore
        .changePassword(this.passwordForm.value)
        .then(() => {
          this.notificationService.success('Password updated successfully');
          this.passwordForm.reset();
          this.showPasswordForm.set(false);
        })
        .catch((err) => {
          this.notificationService.error(err?.error?.message || 'Failed to update password');
        });
    }
  }
}
