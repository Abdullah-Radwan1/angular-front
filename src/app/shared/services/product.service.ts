import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ApiService } from './api.service';
import { Product } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private api: ApiService) {}

  // 🔥 CACHE STREAMS
  private fastSelling$?: Observable<Product[]>;
  private featured$?: Observable<Product[]>;

  // 🔥 Fast selling (cached)
  getFastSellingProducts(): Observable<Product[]> {
    if (!this.fastSelling$) {
      this.fastSelling$ = this.api.get<Product[]>('/products/fast-selling').pipe(shareReplay(1));
    }
    return this.fastSelling$;
  }

  // ⭐ Featured products (cached)
  getFeaturedProducts(): Observable<Product[]> {
    if (!this.featured$) {
      this.featured$ = this.api.get<Product[]>('/products/featured').pipe(shareReplay(1));
    }
    return this.featured$;
  }
}
