import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);

  getNotifications() {
    return this.notifications.asReadonly();
  }

  success(message: string, duration = 5000) {
    this.addNotification('success', message, duration);
  }

  error(message: string, duration = 7000) {
    this.addNotification('error', message, duration);
  }

  warning(message: string, duration = 6000) {
    this.addNotification('warning', message, duration);
  }

  info(message: string, duration = 5000) {
    this.addNotification('info', message, duration);
  }

  removeNotification(id: string) {
    this.notifications.update((notifications) => notifications.filter((n) => n.id !== id));
  }

  private addNotification(type: Notification['type'], message: string, duration: number) {
    const id = Date.now().toString();
    const notification: Notification = { id, type, message, duration };

    this.notifications.update((notifications) => [...notifications, notification]);

    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(id);
      }, duration);
    }
  }
}
