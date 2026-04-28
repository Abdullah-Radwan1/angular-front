import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api'; // Your Backend URL

  getProjects() {
    return this.http.get<any[]>(`${this.apiUrl}/projects`);
  }
}
