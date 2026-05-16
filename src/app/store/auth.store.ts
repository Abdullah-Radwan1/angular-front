import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import {
  User,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
} from '../shared/models/api-response-model';
import { CartStore } from './cart.store';
import { AuthService } from '../shared/services/auth.service';

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

    isAdmin: computed(() => store.user()?.role?.toLowerCase() === 'admin'),
  })),

  withMethods((store) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const cartStore = inject(CartStore);

    return {
      // ------------------------------------------------------
      // LOGIN
      // ------------------------------------------------------
      login: async (credentials: LoginRequest) => {
        patchState(store, { loading: true });

        try {
          const response = await firstValueFrom(authService.login(credentials));
          const userData = response.user;

          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

          patchState(store, {
            user: userData,
            loading: false,
          });

          // Merge Cart
          await cartStore.mergeCartWithServer();

          await router.navigate(['/']);
        } catch (error) {
          patchState(store, { loading: false });
          throw error;
        }
      },

      // ------------------------------------------------------
      // REGISTER
      // ------------------------------------------------------
      register: async (data: RegisterRequest) => {
        patchState(store, { loading: true });

        try {
          const response = await firstValueFrom(authService.register(data));
          const userData = response.user;

          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

          patchState(store, {
            user: userData,
            loading: false,
          });

          // Merge Cart
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
          const response = await firstValueFrom(authService.getCurrentUser());
          const userData = response.user;

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
          await firstValueFrom(authService.logout());
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
          await firstValueFrom(authService.changePassword(data));
          patchState(store, { loading: false });
        } catch (error) {
          patchState(store, { loading: false });
          throw error;
        }
      },
    };
  }),
);
