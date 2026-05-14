import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../shared/models/api-response-model';
import { AuthStore } from '../../store/auth.store';
import { NotificationService } from '../../shared/services/notification.service';
import {
  LucideLock,
  LucideLogIn,
  LucideMail,
  LucidePackage,
  LucidePhone,
  LucideUser,
  LucideUserPlus,
} from '@lucide/angular';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucidePackage,
    LucideMail,
    LucideLock,
    LucideUser,
    LucideLogIn,
    LucideUserPlus,
    LucidePhone,
    ReactiveFormsModule,
  ],
  templateUrl: './auth.component.html',
  styles: [],
})
export class AuthComponent {
  isLoginMode = signal(true);
  isLoading = signal(false);
  authForm: FormGroup;
  readonly authStore = inject(AuthStore);
  readonly notification = inject(NotificationService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.authForm = this.createForm();
  }
  emailOrPhoneValidator(form: FormGroup) {
    const email = form.get('email')?.value;
    const phone = form.get('phone')?.value;

    if (!email && !phone) {
      return { emailOrPhoneRequired: true };
    }

    return null;
  }
  private createForm(): FormGroup {
    if (this.isLoginMode()) {
      return this.fb.group({
        identifier: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    }

    return this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.email],
        phone: ['', [Validators.minLength(11)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validators: this.emailOrPhoneValidator,
      },
    );
  }

  toggleMode(): void {
    this.isLoginMode.update((mode) => !mode);
    this.authForm = this.createForm();
  }

  async onSubmit(): Promise<void> {
    if (this.authForm.invalid) {
      this.notification.error('Please fill in all required fields correctly');
      return;
    }

    this.isLoading.set(true);

    try {
      const formValue = this.authForm.value;
      if (this.isLoginMode()) {
        await this.authStore.login({
          identifier: formValue.identifier,
          password: formValue.password,
        });
        this.notification.success('Welcome back!');
      } else {
        const registerData: RegisterRequest = {
          name: `${formValue.firstName} ${formValue.lastName}`,
          email: formValue.email || undefined,
          phone: formValue.phone || undefined,
          password: formValue.password,
        };

        await this.authStore.register(registerData);
        this.notification.success('Account created successfully!');
      }
    } catch (error: any) {
      const message = error.error?.message || 'Authentication failed';
      this.notification.error(message);
    } finally {
      this.isLoading.set(false);
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.authForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Invalid email address';
    if (control.errors['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
    }
    return 'Invalid field';
  }
}
