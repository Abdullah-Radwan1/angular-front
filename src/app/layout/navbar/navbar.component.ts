import { Component, HostListener, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  scrolled = false;
  mobileOpen = false;

  readonly authStore = inject(AuthStore);
  readonly cartStore = inject(CartStore);

  isAuthenticated = this.authStore.isAuthenticated;
  isAdmin = this.authStore.isAdmin;
  currentUser = this.authStore.user;
  cartCount = this.cartStore.totalItems;

  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user || !user.name) return '';
    return user.name.charAt(0).toUpperCase();
  });

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 50;
  }

  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobile() {
    this.mobileOpen = false;
  }

  logout(): void {
    this.authStore.logout();
  }
}

