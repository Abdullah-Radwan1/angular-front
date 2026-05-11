// import { HttpClient } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

// import { orderDto, orderSchema } from '../utils/product.schema';
// import { environment } from '../enviroments/enviroment';
// import { catchError, EMPTY } from 'rxjs';

// const API_URL = environment.apiUrl;

// type initialState = {
//   orders: orderDto[];
//   orderDetail: orderDto | null;
//   loading: boolean;
//   error: string | null;
// };

// const initialState: initialState = {
//   orders: [],
//   orderDetail: null,
//   loading: false,
//   error: null,
// };

// export const OrderStore = signalStore(
//   { providedIn: 'root' },

//   withState(() => initialState),

//   withMethods((store, http = inject(HttpClient)) => ({
//     /** -------------------------------
//      * GET ORDER BY ID
//      * ------------------------------ */
//     getOrder(id: string) {
//       patchState(store, { loading: true, error: null });
//       http
//         .get<orderDto>(`${API_URL}/order/${id}`)

//         .pipe(
//           catchError((err) => {
//             patchState(store, {
//               error: err.message,
//               loading: false,
//             });
//             return EMPTY;
//           })
//         )
//         .subscribe((order) => {
//           const parsed = orderSchema.parse(order);
//           patchState(store, {
//             orderDetail: parsed,
//             loading: false,
//           });
//         });
//     },

//     /** -------------------------------
//      * SET ERROR
//      * ------------------------------ */
//     setError(error: any) {
//       patchState(store, {
//         error,
//       });
//     },
//   }))
// );
