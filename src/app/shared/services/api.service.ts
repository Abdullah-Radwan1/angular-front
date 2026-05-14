import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:3000/v1';

  private readonly loading = signal(false);

  // Global options for cookie auth
  private readonly defaultOptions = {
    withCredentials: true,
  };

  constructor(private http: HttpClient) {}

  // ================= GET =================

  get<T>(endpoint: string, options?: { params?: any }): Observable<T> {
    this.loading.set(true);

    const httpOptions = {
      ...this.defaultOptions,

      params: options?.params
        ? new HttpParams({
            fromObject: options.params,
          })
        : undefined,
    };

    return this.http.get<T>(`${this.baseUrl}${endpoint}`, httpOptions).pipe(
      catchError(this.handleError),
      finalize(() => this.loading.set(false)),
    );
  }

  // ================= POST =================

  post<T>(endpoint: string, data: unknown): Observable<T> {
    this.loading.set(true);

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, this.defaultOptions).pipe(
      catchError(this.handleError),
      finalize(() => this.loading.set(false)),
    );
  }

  // ================= POST FORM DATA =================

  postFormData<T>(endpoint: string, formData: FormData): Observable<T> {
    this.loading.set(true);

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData, this.defaultOptions).pipe(
      catchError(this.handleError),
      finalize(() => this.loading.set(false)),
    );
  }

  // ================= PUT =================

  put<T>(endpoint: string, data: unknown): Observable<T> {
    this.loading.set(true);

    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, this.defaultOptions).pipe(
      catchError(this.handleError),
      finalize(() => this.loading.set(false)),
    );
  }

  // ================= PUT FORM DATA =================

  putFormData<T>(endpoint: string, formData: FormData): Observable<T> {
    this.loading.set(true);

    return this.http.put<T>(`${this.baseUrl}${endpoint}`, formData, this.defaultOptions).pipe(
      catchError(this.handleError),
      finalize(() => this.loading.set(false)),
    );
  }

  // ================= PATCH =================

  patch<T>(endpoint: string, data: unknown): Observable<T> {
    this.loading.set(true);

    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data, this.defaultOptions).pipe(
      catchError(this.handleError),
      finalize(() => this.loading.set(false)),
    );
  }

  // ================= DELETE =================

  delete<T>(endpoint: string): Observable<T> {
    this.loading.set(true);

    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, this.defaultOptions).pipe(
      catchError(this.handleError),
      finalize(() => this.loading.set(false)),
    );
  }

  // ================= LOADING =================

  isLoading() {
    return this.loading.asReadonly();
  }

  // ================= ERROR HANDLING =================

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || `Error ${error.status}: ${error.message}`;
    }

    console.error(errorMessage);

    return throwError(() => new Error(errorMessage));
  }
}
