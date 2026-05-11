import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.homeRoutes),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then((m) => m.productsRoutes),
  },
  {
    path: 'product/:slug',
    loadComponent: () => {
      return import('./features/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent,
      );
    },
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.routes').then((m) => m.cartRoutes),
    canActivate: [AuthGuard],
  },
  {
    path: 'checkout',
    loadChildren: () => import('./features/checkout/checkout.routes').then((m) => m.checkoutRoutes),
    canActivate: [AuthGuard],
  },
  {
    path: 'orders',

    loadChildren: () => import('./features/orders/orders.routes').then((m) => m.ordersRoutes),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadComponent: () => {
      return import('./features/profile/profile').then((m) => m.ProfileComponent);
    },

    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    loadChildren: () => import('./features/about/about.routes').then((m) => m.aboutRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
    canActivate: [AdminGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
