import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { User } from '../../../shared/models/user.model';
import { PaginatedResponse } from '../../../shared/models/api-response-model';
import { AddressService, Address } from '../../../shared/services/address.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styles: [],
})
export class AdminUsersComponent implements OnInit {
  users = signal<User[]>([]);

  // Address modal states
  selectedUser = signal<User | null>(null);
  userAddresses = signal<Address[]>([]);
  loadingAddresses = signal(false);

  // Filters & Pagination
  searchQuery = signal('');
  roleFilter = signal('all'); // 'all', 'admin', 'user'
  statusFilter = signal('all'); // 'all', 'active', 'deleted'
  currentPage = signal(1);
  totalPages = signal(1);

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private addressService: AddressService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const params: any = {
      page: this.currentPage(),
    };

    if (this.searchQuery()) params.search = this.searchQuery();
    if (this.roleFilter() !== 'all') params.role = this.roleFilter();
    if (this.statusFilter() !== 'all') params.status = this.statusFilter();

    this.apiService.get<PaginatedResponse<User>>('/users', { params }).subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.totalPages.set(res.pagination?.totalPages || 1);
      },
      error: () => this.notificationService.error('Failed to load users'),
    });
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
    this.loadUsers();
  }

  onFilterRole(role: string): void {
    this.roleFilter.set(role);
    this.currentPage.set(1);
    this.loadUsers();
  }

  onFilterStatus(status: string): void {
    this.statusFilter.set(status);
    this.currentPage.set(1);
    this.loadUsers();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadUsers();
    }
  }

  updateRole(user: User, event: Event): void {
    const newRole = (event.target as HTMLSelectElement).value;
    if (newRole === user.role) return;

    this.apiService.put(`/users/${user._id}/role`, { role: newRole }).subscribe({
      next: () => {
        this.notificationService.success(`User role updated to ${newRole}`);
        this.loadUsers();
      },
      error: () => this.notificationService.error('Failed to update user role'),
    });
  }

  toggleDelete(user: User): void {
    const action = user.isDeleted ? 'restore' : 'delete';
    if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
      this.apiService.delete(`/users/${user._id}`).subscribe({
        next: () => {
          this.notificationService.success(`User ${action}d successfully`);
          this.loadUsers();
        },
        error: () => this.notificationService.error(`Failed to ${action} user`),
      });
    }
  }

  viewAddresses(user: User): void {
    this.selectedUser.set(user);
    this.loadingAddresses.set(true);
    this.userAddresses.set([]);

    this.addressService.getUserAddresses(user._id).subscribe({
      next: (res) => {
        this.userAddresses.set(res.data.addresses);
        this.loadingAddresses.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to load user addresses');
        this.loadingAddresses.set(false);
        this.selectedUser.set(null);
      },
    });
  }

  closeAddressesModal(): void {
    this.selectedUser.set(null);
    this.userAddresses.set([]);
  }
}
