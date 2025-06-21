export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export interface AuthError {
  message: string;
  field?: keyof LoginFormData;
}