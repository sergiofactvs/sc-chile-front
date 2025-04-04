// src/app/models/auth.model.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  tokenExpiration: string;
  user: UserDto;
}

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  playerId: number;
}

export interface UserRegistrationRequest {
  firstName: string;
  lastName: string;  
  country: string;
  description?: string;
  email: string;
  password: string;
  confirmPassword: string;
  alias: string;
  gateway: number;
  playerId?: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}