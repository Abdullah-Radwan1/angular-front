import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthStore } from '../../../store/auth.store';
import { CartStore } from '../../../store/cart.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent {
  readonly authStore = inject(AuthStore);
  readonly cartStore = inject(CartStore);

  // Expose signals for easier use in template
  isAuthenticated = this.authStore.isAuthenticated;
  isAdmin = this.authStore.isAdmin;
  currentUser = this.authStore.user;
  cartCount = this.cartStore.totalItems;

  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user || !user.name) return '';
    return user.name.charAt(0).toUpperCase();
  });

  logout(): void {
    this.authStore.logout();
  }
}
