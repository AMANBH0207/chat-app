export interface User {
  room_id: string;
  _id: string;
  name: string;
  email: string;
  avatarPromptAccepted: boolean;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export interface SearchUsersResponse {
  success: boolean;
  data: User[];
}