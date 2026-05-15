import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Product } from '../models/api-response-model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private api: ApiService) {}

  // ------------------------------------------------------
  // FETCH ALL PRODUCTS
  // ------------------------------------------------------
  getProducts(search?: string) {
    const params: any = {};
    if (search) params.search = search;
    return this.api.get<Product[]>('/products', { params });
  }

  // ------------------------------------------------------
  // FETCH PRODUCT BY ID
  // ------------------------------------------------------
  getProductById(id: string) {
    return this.api.get<Product>(`/products/${id}`);
  }

  // ------------------------------------------------------
  // FETCH CATEGORY PRODUCTS
  // ------------------------------------------------------
  getCategoryProducts(category: string) {
    const params: any = {};
    if (category && category !== 'ALL') params.category = category;
    return this.api.get<Product[]>('/products/category', { params });
  }

  // ------------------------------------------------------
  // FETCH RELATED PRODUCTS
  // ------------------------------------------------------
  getRelatedProducts(category: string) {
    return this.api.get<Product[]>('/products/related', { params: { category } });
  }

  // ------------------------------------------------------
  // FETCH FEATURED PRODUCTS
  // ------------------------------------------------------
  getFeaturedProducts() {
    return this.api.get<Product[]>('/products/featured');
  }

  // ------------------------------------------------------
  // FETCH FAST SELLING PRODUCTS
  // ------------------------------------------------------
  getFastSellingProducts() {
    return this.api.get<Product[]>('/products/fast-selling');
  }

  // ------------------------------------------------------
  // FETCH FILTERED PRODUCTS
  // ------------------------------------------------------
  getFilteredProducts(filters: any) {
    const params: any = { ...filters };
    if (params.categories) {
      params.categories = params.categories.join(',');
    }
    return this.api.get<Product[]>('/products/filter', { params });
  }
}
