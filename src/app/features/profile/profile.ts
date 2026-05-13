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
} from '@lucide/angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideShieldCheck, LucideLock, LucideKeyRound],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class ProfileComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

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
  }

  ngOnInit(): void {
    // Refresh user data on profile page visit
    this.authStore.loadCurrentUser();
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
