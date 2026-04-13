export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}