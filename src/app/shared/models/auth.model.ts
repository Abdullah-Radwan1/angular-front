import { User } from './user.model';

export interface LoginRequest {
  email: string; // This will act as the identifier (email or phone)
  password: string;
  phone: string;
}

export interface RegisterRequest {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token?: string; // If you also send the token back
  message?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
