import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private notificationService: NotificationService,
  ) {}
  readonly authStore = inject(AuthStore);
  canActivate(): boolean {
    if (this.authStore.isAuthenticated()) {
      return true;
    }

    this.notificationService.warning('Please login to access this page');
    this.router.navigate(['/auth/login']);
    return false;
  }
}
