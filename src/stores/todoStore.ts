import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useLocalStorage } from '../composables/useLocalStorage';
import { useTodoFilter } from '../composables/useTodoFilter';
import { todoService } from '../services/todoService';
import { useUiStore } from './uiStore';
import type { ITodoItem, AppError, Result, TodoStats } from '../types';

export const useTodoStore = defineStore('todo', () => {
  const { data: items, reset: clearStorage } = useLocalStorage<ITodoItem[]>('quasar_todos_v1', []);
  const filterState = useTodoFilter(items);
  const isLoading = ref<boolean>(false);
  const lastError = ref<AppError | null>(null);
  const uiStore = useUiStore();

  const stats = computed<TodoStats>(() => ({
    total: filterState.totalCount.value,
    active: filterState.activeCount.value,
    completed: filterState.completedCount.value
  }));

  function addTodo(title: string): Result<ITodoItem, AppError> {
    isLoading.value = true;
    try {
      const created = todoService.createTodoItem({ title });
      if (!created.ok) {
        lastError.value = created.error;
        uiStore.pushNotification(created.error.message, 'negative');
        return created;
      }
      lastError.value = null;
      items.value.unshift(created.value);
      uiStore.pushNotification('Задача добавлена', 'positive');
      return created;
    } finally {
      isLoading.value = false;
    }
  }

  function toggleTodo(id: number): Result<ITodoItem, AppError> {
    const current = items.value.find((item) => item.id === id);
    if (!current) {
      const err: AppError = {
        kind: 'NOT_FOUND_ERROR',
        entityId: id,
        message: 'Задача не найдена'
      };
      lastError.value = err;
      return { ok: false, error: err };
    }
    const updated = todoService.updateTodoItem(items.value, id, { completed: !current.completed });
    if (!updated.ok) {
      lastError.value = updated.error;
    } else {
      lastError.value = null;
    }
    return updated;
  }

  function removeTodo(id: number): void {
    items.value = items.value.filter((item) => item.id !== id);
    uiStore.pushNotification('Задача удалена', 'info');
  }

  function clearCompleted(): void {
    items.value = items.value.filter((item) => !item.completed);
  }

  return {
    items,
    isLoading,
    lastError,
    stats,
    ...filterState,
    addTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
    clearStorage
  };
});
