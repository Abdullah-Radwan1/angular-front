import { User } from './user.model';

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
