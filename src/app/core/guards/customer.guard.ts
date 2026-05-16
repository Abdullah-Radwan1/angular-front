import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerGuard implements CanActivate {
  constructor(
    private router: Router,
    private notificationService: NotificationService,
  ) {}
  
  readonly authStore = inject(AuthStore);
  
  canActivate(): boolean {
    if (!this.authStore.isAdmin()) {
      return true;
    }

    this.notificationService.warning('Admins cannot access customer pages.');
    this.router.navigate(['/admin']);
    return false;
  }
}
