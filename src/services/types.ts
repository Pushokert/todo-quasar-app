import type { ITodoItem, TodoPriority } from '../types/todo';
import type { UserProfile, UserSettings } from '../stores/userStore';

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface AuthTokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseDto extends AuthTokenPair {
  user: UserProfile;
}

export interface TodoCreatePayload {
  title: string;
  priority?: TodoPriority;
  userId?: number;
}

export interface TodoUpdatePayload {
  title?: string;
  completed?: boolean;
  priority?: TodoPriority;
}

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface ApiServiceState {
  todos: ITodoItem[];
  profile: UserProfile | null;
  settings: UserSettings;
}
