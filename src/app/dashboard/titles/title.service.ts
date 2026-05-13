import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
export interface Title {
  _id?: string;
  main: string;
  subtitle?: string;
  updatedAt?: string;
}
@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private http = inject(HttpClient);
  private baseUrl = '/api/title'; // adjust if needed

  getTitle(): Observable<Title> {
    return this.http.get<Title>(this.baseUrl);
  }

  upsertTitle(data: Partial<Title>): Observable<Title> {
    return this.http.put<Title>(this.baseUrl, data);
  }
}
