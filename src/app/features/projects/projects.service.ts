// project.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { URL } from '../../core/env';
// project.model.ts
export interface Project {
  _id?: string; // MongoDB id
  title: string;
  description?: string;
  technologies: string[];
  liveUrl?: string;
  repoUrl?: string;
  image?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}
@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);

  // GET ALL
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${URL}/projects`);
  }

  // GET BY ID
  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${URL}/projects/${id}`);
  }

  // CREATE
  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${URL}/projects`, project);
  }

  // UPDATE
  updateProject(id: string, project: Project): Observable<Project> {
    return this.http.put<Project>(`${URL}/projects/${id}`, project);
  }

  // DELETE
  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${URL}/projects/${id}`);
  }
}
