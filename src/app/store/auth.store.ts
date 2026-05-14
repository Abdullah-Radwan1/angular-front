import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { firstValueFrom } from 'rxjs';

import { URL } from '../shared/ENV';
import {
  User,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
} from '../shared/models/api-response-model';
import { AuthResponse } from '../shared/models/auth.model';
import { CartStore } from './cart.store';

const USER_STORAGE_KEY = 'auth_user';
const CART_STORAGE_KEY = 'cart';
type AuthState = {
  user: User | null;
  loading: boolean;
};

const storedUser = localStorage.getItem(USER_STORAGE_KEY);

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  loading: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.user()),

    isAdmin: computed(() => store.user()?.role === 'admin'),
  })),

  withMethods((store) => {
    const http = inject(HttpClient);
    const router = inject(Router);
    const cartStore = inject(CartStore);

    return {
      // ------------------------------------------------------
      // LOGIN
      // ------------------------------------------------------
      // ... inside withMethods((store) => {

      login: async (credentials: LoginRequest) => {
        patchState(store, { loading: true });

        try {
          // 1. Backend returns AuthResponse { user, token }
          const response = await firstValueFrom(
            http.post<AuthResponse>(`${URL}/auth/login`, credentials, {
              withCredentials: true,
            }),
          );

          // 2. Extract the user object from the response
          const userData = response.user;

          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

          patchState(store, {
            user: userData,
            loading: false,
          });

          // 3. Merge Cart
          await cartStore.mergeCartWithServer();

          await router.navigate(['/']);
        } catch (error) {
          patchState(store, { loading: false });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        patchState(store, { loading: true });

        try {
          // 1. Backend returns AuthResponse { user, token }
          const response = await firstValueFrom(
            http.post<AuthResponse>(`${URL}/auth/register`, data, {
              withCredentials: true,
            }),
          );

          const userData = response.user;

          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

          patchState(store, {
            user: userData,
            loading: false,
          });

          // 3. Merge Cart
          await cartStore.mergeCartWithServer();

          await router.navigate(['/']);
        } catch (error) {
          patchState(store, { loading: false });
          throw error;
        }
      },
      // ------------------------------------------------------
      // LOAD CURRENT USER
      // ------------------------------------------------------
      loadCurrentUser: async () => {
        patchState(store, { loading: true });

        try {
          const user = await firstValueFrom(
            http.get<any>(`${URL}/auth/profile`, {
              withCredentials: true,
            }),
          );

          // The backend returns { user: { ... } }
          const userData = user.user;

          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

          patchState(store, {
            user: userData,
            loading: false,
          });
        } catch {
          localStorage.removeItem(USER_STORAGE_KEY);

          patchState(store, {
            user: null,
            loading: false,
          });
        }
      },

      // ------------------------------------------------------
      // LOGOUT
      // ------------------------------------------------------
      logout: async () => {
        try {
          await firstValueFrom(
            http.post(
              `${URL}/auth/logout`,
              {},
              {
                withCredentials: true,
              },
            ),
          );
        } catch {}

        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(CART_STORAGE_KEY);

        patchState(store, {
          user: null,
        });

        await router.navigate(['/auth/login']);
      },

      // ------------------------------------------------------
      // CHANGE PASSWORD
      // ------------------------------------------------------
      changePassword: async (data: ChangePasswordRequest) => {
        patchState(store, { loading: true });

        try {
          await firstValueFrom(
            http.post(`${URL}/auth/change-password`, data, {
              withCredentials: true,
            }),
          );
          patchState(store, { loading: false });
        } catch (error) {
          patchState(store, { loading: false });
          throw error;
        }
      },
    };
  }),
);
