import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { User } from '../../../shared/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styles: [],
})
export class AdminUsersComponent implements OnInit {
  users = signal<User[]>([]);
  noSupport = signal(true); // Backend doesn't have user management endpoints

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    // Note: Backend doesn't have /admin/users or user management endpoints
    // This is a placeholder for future implementation
    console.log('User management endpoints not available in current backend');
  }

  toggleUserStatus(user: User): void {
    this.notificationService.error('User management not available in current backend');
  }

  deleteUser(user: User): void {
    this.notificationService.error('User management not available in current backend');
  }
}
