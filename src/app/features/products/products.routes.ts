import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./products.component').then(m => m.ProductsComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('../product-details/product-details.component').then(m => m.ProductDetailsComponent)
  }
];