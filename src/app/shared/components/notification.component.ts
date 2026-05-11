import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styles: [],
})
export class NotificationComponent {
  private notificationService = inject(NotificationService);
  notifications = this.notificationService.getNotifications();

  getAlertClass(type: Notification['type']): string {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      case 'warning':
        return 'alert-warning';
      case 'info':
        return 'alert-info';
      default:
        return 'alert-info';
    }
  }

  remove(id: string): void {
    this.notificationService.removeNotification(id);
  }
}
