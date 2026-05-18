import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../services/notification.service';

import {
  LucideCheckCircle2,
  LucideXCircle,
  LucideAlertTriangle,
  LucideInfo,
} from '@lucide/angular';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, LucideCheckCircle2, LucideXCircle, LucideAlertTriangle, LucideInfo],
  templateUrl: './notification.component.html',
  styles: [],
})
export class NotificationComponent {
  private notificationService = inject(NotificationService);

  notifications = this.notificationService.getNotifications();

  getAlertClass(type: Notification['type']): string {
    const classes: Record<Notification['type'], string> = {
      success: 'border-l-4 border-l-success text-base-content',
      error: 'border-l-4 border-l-error text-base-content',
      warning: 'border-l-4 border-l-warning text-base-content',
      info: 'border-l-4 border-l-info text-base-content',
    };

    return classes[type] || 'border-neutral/20';
  }

  remove(id: string): void {
    this.notificationService.removeNotification(id);
  }
}
