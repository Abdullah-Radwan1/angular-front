import { inject } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  patchState,
  withComputed,
  withHooks,
} from '@ngrx/signals';
import { computed } from '@angular/core';
import { firstValueFrom, Subject, debounceTime } from 'rxjs';
import { NotificationService } from '../shared/services/notification.service';
import { Product, CartItem as SharedCartItem } from '../shared/models/api-response-model';
import { CartService } from '../shared/services/cart.service';

export type CartItem = SharedCartItem & { product: Product };

export type CartState = {
  cart: CartItem[];
  loading: boolean;
};

const getInitialState = (): CartState => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        return {
          cart: JSON.parse(savedCart),
          loading: false,
        };
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }
  return {
    cart: [],
    loading: false,
  };
};

const initialState: CartState = getInitialState();

const saveCart = (cart: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('auth_user');
  }
  return false;
};

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    // 🧠 total items
    totalItems: computed(() => state.cart().reduce((sum, item) => sum + item.quantity, 0)),

    // 🧠 empty check
    isEmpty: computed(() => state.cart().length === 0),

    // 🧠 total price (snapshot-based like backend)
    totalPrice: computed(() =>
      state.cart().reduce((sum, item) => sum + item.quantity * item.priceAtAdd, 0),
    ),

    // 🧠 warning items (price changed)
    hasPriceChanges: computed(() => state.cart().some((item) => item.isPriceChanged)),
  })),

  withMethods((store) => {
    const cartService = inject(CartService);
    const notification = inject(NotificationService);

    // 🚀 1. Debounce logic variables
    const pendingDeltas = new Map<string, number>(); // productId -> total delta to send
    const syncSubject = new Subject<string>();

    // 🚀 2. Private API callers
    const _sendUpdate = async (productId: string, quantity: number) => {
      if (!isAuthenticated()) return;
      try {
        await firstValueFrom(cartService.addToCart(productId, quantity));
        notification.success('Cart synced');
      } catch (err) {
        notification.error('Failed to sync cart update');
      }
    };

    const _sendRemove = async (productId: string) => {
      if (!isAuthenticated()) return;
      try {
        await firstValueFrom(cartService.removeFromCart(productId));
        notification.success('Item removal synced');
      } catch (err) {
        notification.error('Failed to sync cart removal');
      }
    };

    // 🚀 3. Setup Debounce Subscription
    syncSubject.pipe(debounceTime(1000)).subscribe((productId) => {
      const delta = pendingDeltas.get(productId);
      if (delta === undefined) return;

      pendingDeltas.delete(productId);

      if (delta === -999) {
        // Special marker for removal
        _sendRemove(productId);
      } else if (delta !== 0) {
        _sendUpdate(productId, delta);
      }
    });

    // 🚀 4. Internal Methods
    const loadCart = async () => {
      if (!isAuthenticated()) return;
      patchState(store, { loading: true });
      try {
        const res = await firstValueFrom(cartService.getCart());
        const items = (res?.items as CartItem[]) ?? [];
        patchState(store, { cart: items, loading: false });
        saveCart(items);
      } catch {
        patchState(store, { loading: false });
      }
    };

    return {
      // ------------------------------------------------------
      // LOAD CART
      // ------------------------------------------------------
      loadCart,

      // ------------------------------------------------------
      // ADD TO CART (DEBOUNCED)
      // ------------------------------------------------------
      addToCart: async (productOrId: Product | string, quantity = 1) => {
        const productId = typeof productOrId === 'string' ? productOrId : productOrId._id;
        // Optimistic update
        const currentCart = store.cart();
        const existingItemIndex = currentCart.findIndex((item) => item.product._id === productId);

        if (existingItemIndex > -1) {
          const newCart = [...currentCart];
          newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity + quantity,
          };
          patchState(store, { cart: newCart });
          saveCart(newCart);
        } else if (typeof productOrId !== 'string') {
          // New item with full product info (Optimistic)
          const newItem: CartItem = {
            product: productOrId,
            quantity: quantity,
            priceAtAdd: productOrId.price,
            isPriceChanged: false,
          };
          const newCart = [...currentCart, newItem];
          patchState(store, { cart: newCart });
          saveCart(newCart);
        }

        // Always track delta and trigger debounce
        const currentDelta = pendingDeltas.get(productId) || 0;
        if (currentDelta !== -999) {
          pendingDeltas.set(productId, currentDelta + quantity);
          syncSubject.next(productId);
        }
      },

      // ------------------------------------------------------
      // REMOVE ITEM (DEBOUNCED)
      // ------------------------------------------------------
      removeFromCart: async (productId: string) => {
        // Optimistic update
        const newCart = store.cart().filter((item) => item.product._id !== productId);
        patchState(store, { cart: newCart });
        saveCart(newCart);

        // Mark for removal and trigger debounce
        pendingDeltas.set(productId, -999);
        syncSubject.next(productId);
        notification.success('Item removed');
      },

      // ------------------------------------------------------
      // SYNC PRICES
      // ------------------------------------------------------
      syncPrices: async () => {
        if (!isAuthenticated()) return;
        try {
          const res = await firstValueFrom(cartService.syncPrices());
          const items = (res?.items as CartItem[]) ?? [];
          patchState(store, { cart: items });
          saveCart(items);
          notification.success('Prices synced');
        } catch (err) {
          notification.error('Sync failed');
        }
      },

      // ------------------------------------------------------
      // CLEAR CART
      // ------------------------------------------------------
      clearCart: async () => {
        patchState(store, { cart: [] });
        saveCart([]);
        if (!isAuthenticated()) return;
        try {
          const res = await firstValueFrom(cartService.clearCart());
          const items = (res?.items as CartItem[]) ?? [];
          patchState(store, { cart: items });
          saveCart(items);
          notification.success('Cart cleared');
        } catch (err) {
          notification.error('Failed to clear cart');
        }
      },

      // ------------------------------------------------------
      // MERGE GUEST CART
      // ------------------------------------------------------
      mergeCartWithServer: async () => {
        const currentCart = store.cart();
        if (currentCart.length === 0) {
          await loadCart();
          return;
        }

        try {
          const res = await firstValueFrom(cartService.mergeCart(currentCart));
          const items = (res?.items as CartItem[]) ?? [];
          patchState(store, { cart: items });
          saveCart(items);
          notification.success('Cart merged with your account');
        } catch (err) {
          console.error('Failed to merge cart', err);
          await loadCart();
        }
      },
    };
  }),

  withHooks({
    onInit(store) {
      if (isAuthenticated()) {
        store.loadCart();
      }
    },
  }),
);
