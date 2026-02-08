export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  document: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    document: string;
    avatar: string | null;
    phone: string | null;
    role: string;
    owner: boolean;
    companyId?: string;
    createdAt: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  document: string;
  avatar: string | null;
  phone: string | null;
  role: string;
  owner: boolean;
  companyId?: string;
  createdAt: string;
}

// Interfaces para reset de senha
export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}
