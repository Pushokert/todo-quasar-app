export type ErrorKind = 'VALIDATION_ERROR' | 'NOT_FOUND_ERROR' | 'STORAGE_ERROR' | 'NETWORK_ERROR';

export interface ValidationError {
  kind: 'VALIDATION_ERROR';
  field: string;
  message: string;
}

export interface NotFoundError {
  kind: 'NOT_FOUND_ERROR';
  entityId: number | string;
  message: string;
}

export interface StorageError {
  kind: 'STORAGE_ERROR';
  key: string;
  message: string;
}

export interface NetworkError {
  kind: 'NETWORK_ERROR';
  statusCode: number;
  message: string;
}

export type AppError = ValidationError | NotFoundError | StorageError | NetworkError;

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: AppError | null;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

export type Result<T, E = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E };
