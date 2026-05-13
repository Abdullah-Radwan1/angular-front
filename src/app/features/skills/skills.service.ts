import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../core/env';

export type SkillCategoryKey = 'frontend' | 'ui' | 'backend' | 'apis' | 'databases' | 'devops';

export interface Skill {
  _id?: string;
  name: string;
  category: SkillCategoryKey;
  level?: string;
  iconUrl?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  private http = inject(HttpClient);

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${URL}/skills`);
  }

  // CREATE
  createSkill(skill: Omit<Skill, '_id'>): Observable<Skill> {
    return this.http.post<Skill>(`${URL}/skills`, skill);
  }

  // UPDATE
  updateSkill(id: string, skill: Partial<Skill>): Observable<Skill> {
    return this.http.put<Skill>(`${URL}/skills/${id}`, skill);
  }

  // DELETE
  deleteSkill(id: string): Observable<void> {
    return this.http.delete<void>(`${URL}/skills/${id}`);
  }
}
