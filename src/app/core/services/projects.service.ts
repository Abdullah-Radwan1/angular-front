// project.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { URL } from '../env';
// project.model.ts
export interface Project {
  _id?: string; // MongoDB id
  title: string;
  description?: string;
  technologies: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageUrl?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}
@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);

  // GET ALL
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(URL);
  }

  // GET BY ID
  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${URL}/${id}`);
  }

  // CREATE
  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(URL, project);
  }

  // UPDATE
  updateProject(id: string, project: Project): Observable<Project> {
    return this.http.put<Project>(`${URL}/${id}`, project);
  }

  // DELETE
  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${URL}/${id}`);
  }
}
