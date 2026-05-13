import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent {
  readonly authStore = inject(AuthStore);

  get isAuthenticated() {
    return this.authStore.isAuthenticated();
  }

  get isAdmin() {
    return this.authStore.isAdmin();
  }

  get currentUser() {
    return this.authStore.user();
  }

  userInitials = computed(() => {
    const name = this.authStore.user()?.name.charAt(0).toUpperCase();

    console.log(this.authStore.user());
    if (!name) {
      return '';
    }

    return name;
  });

  cartCount = 0;

  logout(): void {
    this.authStore.logout();
  }
}
