import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private router: Router,
    private notificationService: NotificationService,
  ) {}
  readonly authStore = inject(AuthStore);
  canActivate(): boolean {
    if (!this.authStore.isAuthenticated()) {
      return true;
    }

    this.notificationService.warning('You are already logged in');
    this.router.navigate(['/']);
    return false;
  }
}
