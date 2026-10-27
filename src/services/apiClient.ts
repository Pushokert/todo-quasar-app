import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig
} from 'axios';
import type { CacheEntry } from './types';

class TokenVault {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public getRefreshToken(): string | null {
    return this.refreshToken;
  }

  public setTokens(access: string, refresh?: string): void {
    this.accessToken = access;
    if (refresh !== undefined) {
      this.refreshToken = refresh;
    }
  }

  public clear(): void {
    this.accessToken = null;
    this.refreshToken = null;
  }
}

export class ApiClient {
  private readonly instance: AxiosInstance;
  private readonly tokenVault = new TokenVault();
  private readonly cache = new Map<string, CacheEntry<unknown>>();
  private readonly cacheTtlMs = 30000;

  constructor(baseURL = '/api') {
    this.instance = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = this.tokenVault.getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalConfig = error?.config as (AxiosRequestConfig & { _retried?: boolean }) | undefined;
        if (error?.response?.status === 401 && originalConfig && !originalConfig._retried) {
          originalConfig._retried = true;
          const refresh = this.tokenVault.getRefreshToken();
          if (refresh) {
            const newAccess = `mock-jwt.${btoa(JSON.stringify({ sub: 1, exp: Date.now() + 3600000 }))}.sig`;
            this.tokenVault.setTokens(newAccess);
            return this.instance.request(originalConfig);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public setAuthTokens(accessToken: string, refreshToken?: string): void {
    this.tokenVault.setTokens(accessToken, refreshToken);
  }

  public clearAuthTokens(): void {
    this.tokenVault.clear();
  }

  public createAbortController(): AbortController {
    return new AbortController();
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public async requestWithRetry<T>(
    fn: () => Promise<T>,
    retries = 2,
    delayMs = 150
  ): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
        }
      }
    }
    throw lastError;
  }

  public async getCached<T>(url: string, config?: AxiosRequestConfig, useCache = true): Promise<T> {
    if (useCache) {
      const hit = this.cache.get(url);
      if (hit && hit.expiresAt > Date.now()) {
        return hit.value as T;
      }
    }
    const response = await this.requestWithRetry(() => this.instance.get<T>(url, config));
    this.cache.set(url, {
      value: response.data,
      expiresAt: Date.now() + this.cacheTtlMs
    });
    return response.data;
  }

  public async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    this.clearCache();
    const response = await this.requestWithRetry(() => this.instance.post<T>(url, data, config));
    return response.data;
  }

  public async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    this.clearCache();
    const response = await this.requestWithRetry(() => this.instance.patch<T>(url, data, config));
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    this.clearCache();
    const response = await this.requestWithRetry(() => this.instance.delete<T>(url, config));
    return response.data;
  }
}

export const apiClient = new ApiClient();
