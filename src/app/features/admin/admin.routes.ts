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
    path: 'refunds',
    loadComponent: () => import('./refunds/admin-refunds.component').then(m => m.AdminRefundsComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./categories/admin-categories.component').then(m => m.AdminCategoriesComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/admin-reports.component').then(m => m.AdminReportsComponent)
  },
  {
    path: 'testimonials',
    loadComponent: () => import('./testimonials/admin-testimonials.component').then(m => m.AdminTestimonialsComponent)
  }
];