import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { URL } from '../shared/ENV';
import { Product } from '../shared/models';

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
    const http = inject(HttpClient);

    return {
      // ------------------------------------------------------
      // LOAD ALL PRODUCTS
      // ------------------------------------------------------
      loadProducts: async () => {
        patchState(store, { loading: true, error: null });

        try {
          const products = await firstValueFrom(http.get<Product[]>(`${URL}/products`));

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
          const product = await firstValueFrom(http.get<Product>(`${URL}/products/${id}`));

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
          const params: any = {};
          if (category && category !== 'ALL') params.category = category;

          const data = await firstValueFrom(
            http.get<Product[]>(`${URL}/products/category`, { params }),
          );

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
          const data = await firstValueFrom(
            http.get<Product[]>(`${URL}/products/related`, {
              params: { category },
            }),
          );

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
          const data = await firstValueFrom(http.get<Product[]>(`${URL}/products/featured`));

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
      loadFastSellingProducts: async () => {
        patchState(store, { loading: true });

        try {
          const data = await firstValueFrom(http.get<Product[]>(`${URL}/products/fast-selling`));

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
          const data = await firstValueFrom(
            http.get<Product[]>(`${URL}/products`, {
              params: { search: term },
            }),
          );

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
      loadFilteredProducts: async ({ minPrice, maxPrice, categories, sort, search }: any) => {
        patchState(store, { loading: true, error: null });

        try {
          const params: any = {
            minPrice,
            maxPrice,
            sort,
            search,
          };

          if (categories) {
            params.categories = categories.join(',');
          }

          const data = await firstValueFrom(
            http.get<Product[]>(`${URL}/products/filter`, { params }),
          );

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
