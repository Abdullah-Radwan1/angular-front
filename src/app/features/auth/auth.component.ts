import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest, RegisterRequest } from '../../shared/models';
import { AuthStore } from '../../store/auth.store';
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
    if (this.authForm.invalid) return;

    this.isLoading.set(true);

    try {
      const formValue = this.authForm.value;
      if (this.isLoginMode()) {
        await this.authStore.login({
          email: formValue.identifier,
          password: formValue.password,
          phone: formValue.identifier, // Send as both to be safe with backend extraction
        } as LoginRequest);
      } else {
        const registerData: RegisterRequest = {
          name: `${formValue.firstName} ${formValue.lastName}`,
          email: formValue.email || undefined,
          phone: formValue.phone || undefined,
          password: formValue.password,
        };
        await this.authStore.register(registerData);
      }
    } catch (error) {
      // Error handled in service
    } finally {
      this.isLoading.set(false);
    }
  }
}
