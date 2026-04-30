import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../core/env';

export interface ExperienceItem {
  _id?: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  bullets: string[];
  order?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private http = inject(HttpClient);

  getExperiences(): Observable<ExperienceItem[]> {
    return this.http.get<ExperienceItem[]>(`${URL}/experiences`);
  }

  createExperience(experience: Omit<ExperienceItem, '_id'>): Observable<ExperienceItem> {
    return this.http.post<ExperienceItem>(`${URL}/experiences`, experience);
  }

  updateExperience(id: string, experience: Partial<ExperienceItem>): Observable<ExperienceItem> {
    return this.http.put<ExperienceItem>(`${URL}/experiences/${id}`, experience);
  }

  deleteExperience(id: string): Observable<void> {
    return this.http.delete<void>(`${URL}/experiences/${id}`);
  }
}
