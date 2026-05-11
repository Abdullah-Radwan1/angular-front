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

  private createForm(): FormGroup {
    const form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    if (!this.isLoginMode()) {
      (form as any).addControl('firstName', this.fb.control('', Validators.required));
      (form as any).addControl('lastName', this.fb.control('', Validators.required));
    }

    return form;
  }

  toggleMode(): void {
    this.isLoginMode.update((mode) => !mode);
    this.authForm = this.createForm();
  }

  async onSubmit(): Promise<void> {
    if (this.authForm.invalid) return;

    this.isLoading.set(true);

    try {
      if (this.isLoginMode()) {
        await this.authStore.login(this.authForm.value as LoginRequest);
      } else {
        const formValue = this.authForm.value;
        const registerData: RegisterRequest = {
          name: `${formValue.firstName} ${formValue.lastName}`,
          email: formValue.email,
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
