export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  createdAt: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}