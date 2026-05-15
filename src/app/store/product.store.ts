import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { Product } from '../shared/models/api-response-model';
import { ProductService } from '../shared/services/product.service';

export interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  relatedProducts: Product[];
  categoryProducts: Product[];
  fastSellingProducts: Product[];

  selectedProduct: Product | null;

  loading: boolean;
  relatedLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  fastSellingProducts: [],

  products: [],
  featuredProducts: [],
  relatedProducts: [],
  categoryProducts: [],
  selectedProduct: null,

  loading: false,
  relatedLoading: false,
  error: null,
};

export const productStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods((store) => {
    const productService = inject(ProductService);

    return {
      // ------------------------------------------------------
      // LOAD ALL PRODUCTS
      // ------------------------------------------------------
      loadProducts: async (search?: string) => {
        patchState(store, { loading: true, error: null });

        try {
          const products = await firstValueFrom(productService.getProducts(search));

          patchState(store, { products, loading: false });
        } catch (err: any) {
          patchState(store, {
            error: err?.message ?? 'Failed to load products',
            loading: false,
          });
        }
      },

      // ------------------------------------------------------
      // PRODUCT BY ID
      // ------------------------------------------------------
      loadProductById: async (id: string) => {
        patchState(store, { loading: true, error: null });

        try {
          const product = await firstValueFrom(productService.getProductById(id));

          patchState(store, {
            selectedProduct: product,
            loading: false,
          });
        } catch (err: any) {
          patchState(store, {
            error: err?.message ?? 'Failed to load product',
            loading: false,
          });
        }
      },

      // ------------------------------------------------------
      // CATEGORY
      // ------------------------------------------------------
      loadCategoryProducts: async (category: string) => {
        patchState(store, { loading: true, error: null });

        try {
          const data = await firstValueFrom(productService.getCategoryProducts(category));

          patchState(store, {
            categoryProducts: data,
            loading: false,
          });
        } catch (err: any) {
          patchState(store, {
            error: err?.message,
            loading: false,
          });
        }
      },

      // ------------------------------------------------------
      // RELATED
      // ------------------------------------------------------
      loadRelatedProducts: async (category: string) => {
        patchState(store, { relatedLoading: true });

        try {
          const data = await firstValueFrom(productService.getRelatedProducts(category));

          patchState(store, {
            relatedProducts: data,
            relatedLoading: false,
          });
        } catch {
          patchState(store, { relatedLoading: false });
        }
      },

      // ------------------------------------------------------
      // FEATURED
      // ------------------------------------------------------
      loadFeaturedProducts: async () => {
        patchState(store, { loading: true });

        try {
          const data = await firstValueFrom(productService.getFeaturedProducts());

          patchState(store, {
            featuredProducts: data,
            loading: false,
          });
        } catch (err: any) {
          patchState(store, {
            error: err?.message,
            loading: false,
          });
        }
      },

      // ------------------------------------------------------
      // FAST SELLING
      // ------------------------------------------------------
      loadFastSellingProducts: async () => {
        patchState(store, { loading: true });

        try {
          const data = await firstValueFrom(productService.getFastSellingProducts());

          patchState(store, {
            fastSellingProducts: data,
            loading: false,
          });
        } catch (err: any) {
          patchState(store, {
            error: err?.message,
            loading: false,
          });
        }
      },

      // ------------------------------------------------------
      // SEARCH
      // ------------------------------------------------------
      searchProducts: async (term: string) => {
        patchState(store, { loading: true, error: null });

        try {
          const data = await firstValueFrom(productService.getProducts(term));

          patchState(store, {
            products: data,
            loading: false,
          });
        } catch (err: any) {
          patchState(store, {
            error: err?.message,
            loading: false,
          });
        }
      },

      // ------------------------------------------------------
      // FILTER
      // ------------------------------------------------------
      loadFilteredProducts: async (filters: any) => {
        patchState(store, { loading: true, error: null });

        try {
          const data = await firstValueFrom(productService.getFilteredProducts(filters));

          patchState(store, {
            products: data,
            loading: false,
          });
        } catch (err: any) {
          patchState(store, {
            error: err?.message,
            loading: false,
          });
        }
      },

      // ------------------------------------------------------
      // CLEAR
      // ------------------------------------------------------
      clearSelectedProduct: () => {
        patchState(store, { selectedProduct: null });
      },
    };
  }),
);
