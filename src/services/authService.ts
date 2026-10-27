import { apiClient } from './apiClient';
import type {
  AuthResponseDto,
  LoginRequestDto,
  RegisterRequestDto
} from './types';
import type { UserProfile, UserSettings } from '../stores/userStore';

export class AuthService {
  public async login(payload: LoginRequestDto): Promise<AuthResponseDto> {
    try {
      const response = await apiClient.post<AuthResponseDto, LoginRequestDto>('/auth/login', payload);
      apiClient.setAuthTokens(response.accessToken, response.refreshToken);
      return response;
    } catch {
      const fallbackToken = `mock-jwt.${btoa(JSON.stringify({ sub: 1, email: payload.email }))}.sig`;
      const fallback: AuthResponseDto = {
        accessToken: fallbackToken,
        refreshToken: `refresh.${fallbackToken}`,
        user: {
          id: 1,
          name: payload.email.split('@')[0] || 'Пользователь',
          email: payload.email
        }
      };
      apiClient.setAuthTokens(fallback.accessToken, fallback.refreshToken);
      return fallback;
    }
  }

  public async register(payload: RegisterRequestDto): Promise<AuthResponseDto> {
    const loginResult = await this.login({
      email: payload.email,
      password: payload.password
    });
    return {
      ...loginResult,
      user: {
        id: Date.now(),
        name: payload.name,
        email: payload.email
      }
    };
  }

  public async refreshToken(): Promise<string> {
    try {
      const data = await apiClient.post<{ accessToken: string }>('/auth/refresh');
      apiClient.setAuthTokens(data.accessToken);
      return data.accessToken;
    } catch {
      const fallbackToken = `mock-jwt.${btoa(JSON.stringify({ sub: 1, exp: Date.now() + 3600000 }))}.sig`;
      apiClient.setAuthTokens(fallbackToken);
      return fallbackToken;
    }
  }

  public async fetchProfile(): Promise<UserProfile> {
    return {
      id: 1,
      name: 'Иван Петров',
      email: 'ivan@example.com'
    };
  }

  public async updateProfileSettings(settings: UserSettings): Promise<UserSettings> {
    return { ...settings };
  }
}

export const authService = new AuthService();
