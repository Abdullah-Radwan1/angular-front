import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:3000/v1';
  private loading = signal(false);

  constructor(private http: HttpClient) {}

  // ================= GET =================
  get<T>(endpoint: string, options?: { params?: any }): Observable<T> {
    this.loading.set(true);

    const httpOptions = options ? { params: new HttpParams({ fromObject: options.params }) } : {};

    return this.http.get<T>(`${this.baseUrl}${endpoint}`, httpOptions).pipe(
      catchError(this.handleError.bind(this)),
      finalize(() => this.loading.set(false)),
    );
  }

  // ================= POST =================
  post<T>(endpoint: string, data: any): Observable<T> {
    this.loading.set(true);

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data).pipe(
      catchError(this.handleError.bind(this)),
      finalize(() => this.loading.set(false)),
    );
  }

  // ================= PUT =================
  put<T>(endpoint: string, data: any): Observable<T> {
    this.loading.set(true);

    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data).pipe(
      catchError(this.handleError.bind(this)),
      finalize(() => this.loading.set(false)),
    );
  }

  // ================= DELETE =================
  delete<T>(endpoint: string): Observable<T> {
    this.loading.set(true);

    return this.http.delete<T>(`${this.baseUrl}${endpoint}`).pipe(
      catchError(this.handleError.bind(this)),
      finalize(() => this.loading.set(false)),
    );
  }

  // ================= PATCH =================
  patch<T>(endpoint: string, data: any): Observable<T> {
    this.loading.set(true);

    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data).pipe(
      catchError(this.handleError.bind(this)),
      finalize(() => this.loading.set(false)),
    );
  }

  // ================= LOADING STATE =================
  isLoading() {
    return this.loading.asReadonly();
  }

  // ================= ERROR HANDLING =================
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);

    return throwError(() => new Error(errorMessage));
  }
}
