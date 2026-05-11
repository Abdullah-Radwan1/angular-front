import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./products/admin-products.component').then(m => m.AdminProductsComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/admin-orders.component').then(m => m.AdminOrdersComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./users/admin-users.component').then(m => m.AdminUsersComponent)
  },
  {
    path: 'returns',
    loadComponent: () => import('./refunds/admin-refunds.component').then(m => m.AdminRefundsComponent)
  }
];