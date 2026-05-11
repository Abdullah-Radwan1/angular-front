import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { firstValueFrom } from 'rxjs';

import { URL } from '../shared/ENV';

const USER_STORAGE_KEY = 'auth_user';

export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

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

    return {
      // ------------------------------------------------------
      // LOGIN
      // ------------------------------------------------------
      login: async (credentials: LoginRequest) => {
        patchState(store, { loading: true });

        try {
          const user = await firstValueFrom(
            http.post<User>(`${URL}/auth/login`, credentials, {
              withCredentials: true,
            }),
          );

          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

          patchState(store, {
            user,
            loading: false,
          });

          await router.navigate(['/']);
        } catch (error) {
          patchState(store, {
            loading: false,
          });

          throw error;
        }
      },

      // ------------------------------------------------------
      // REGISTER
      // ------------------------------------------------------
      register: async (data: RegisterRequest) => {
        patchState(store, { loading: true });

        try {
          const user = await firstValueFrom(
            http.post<User>(`${URL}/auth/register`, data, {
              withCredentials: true,
            }),
          );

          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

          patchState(store, {
            user,
            loading: false,
          });

          await router.navigate(['/']);
        } catch (error) {
          patchState(store, {
            loading: false,
          });

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

        patchState(store, {
          user: null,
        });

        await router.navigate(['/auth/login']);
      },
    };
  }),
);
