import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  AuthResponse,
} from '../models/api-response-model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private api: ApiService) {}

  login(credentials: LoginRequest) {
    return this.api.post<AuthResponse>('/auth/login', credentials);
  }

  register(data: RegisterRequest) {
    return this.api.post<AuthResponse>('/auth/register', data);
  }

  getCurrentUser() {
    return this.api.get<{ user: any }>('/auth/profile');
  }

  logout() {
    return this.api.post('/auth/logout', {});
  }

  changePassword(data: ChangePasswordRequest) {
    return this.api.post('/auth/change-password', data);
  }
}
