import { apiClient } from './apiClient';
import type {
  ITodoItem,
  CreateTodoDto,
  UpdateTodoDto,
  Result,
  AppError,
  ApiResponse
} from '../types';

export class TodoService {
  public validateCreateDto(dto: CreateTodoDto): Result<CreateTodoDto, AppError> {
    const trimmed = dto.title.trim();
    if (trimmed.length < 2) {
      return {
        ok: false,
        error: {
          kind: 'VALIDATION_ERROR',
          field: 'title',
          message: 'Название задачи должно содержать минимум 2 символа'
        }
      };
    }
    if (trimmed.length > 120) {
      return {
        ok: false,
        error: {
          kind: 'VALIDATION_ERROR',
          field: 'title',
          message: 'Название задачи не должно превышать 120 символов'
        }
      };
    }
    return {
      ok: true,
      value: {
        title: trimmed,
        priority: dto.priority ?? 'medium'
      }
    };
  }

  public createTodoItem(dto: CreateTodoDto): Result<ITodoItem, AppError> {
    const validation = this.validateCreateDto(dto);
    if (!validation.ok) {
      return validation;
    }
    const newItem: ITodoItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      title: validation.value.title,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: validation.value.priority
    };
    return { ok: true, value: newItem };
  }

  public updateTodoItem(items: ITodoItem[], id: number, patch: UpdateTodoDto): Result<ITodoItem, AppError> {
    const idx = items.findIndex((item) => item.id === id);
    if (idx === -1) {
      return {
        ok: false,
        error: {
          kind: 'NOT_FOUND_ERROR',
          entityId: id,
          message: `Задача с ID ${id} не найдена`
        }
      };
    }
    if (patch.title !== undefined && patch.title.trim().length < 2) {
      return {
        ok: false,
        error: {
          kind: 'VALIDATION_ERROR',
          field: 'title',
          message: 'Название задачи должно содержать минимум 2 символа'
        }
      };
    }
    const updated: ITodoItem = {
      ...items[idx],
      ...patch,
      title: patch.title !== undefined ? patch.title.trim() : items[idx].title
    };
    items[idx] = updated;
    return { ok: true, value: updated };
  }

  public async fetchTodosAsync(signal?: AbortSignal): Promise<ITodoItem[]> {
    try {
      return await apiClient.getCached<ITodoItem[]>('/todos', { signal });
    } catch {
      return [];
    }
  }

  public async createTodoAsync(dto: CreateTodoDto): Promise<Result<ITodoItem, AppError>> {
    const localResult = this.createTodoItem(dto);
    if (!localResult.ok) {
      return localResult;
    }
    try {
      const remote = await apiClient.post<ITodoItem, CreateTodoDto>('/todos', localResult.value);
      return { ok: true, value: remote };
    } catch {
      return localResult;
    }
  }

  public async deleteTodoAsync(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/todos/${id}`);
      return true;
    } catch {
      return true;
    }
  }

  public toApiResponse<T>(result: Result<T, AppError>): ApiResponse<T> {
    if (result.ok) {
      return {
        success: true,
        data: result.value,
        error: null,
        timestamp: new Date().toISOString()
      };
    }
    return {
      success: false,
      data: null,
      error: result.error,
      timestamp: new Date().toISOString()
    };
  }
}

export const todoService = new TodoService();
