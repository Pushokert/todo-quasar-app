import { ref, computed, type Ref, type ComputedRef } from 'vue';
import type { ITodoItem, TodoFilterType } from '../types/todo';

export interface UseTodoFilterReturn {
  filter: Ref<TodoFilterType>;
  searchQuery: Ref<string>;
  filteredTodos: ComputedRef<ITodoItem[]>;
  totalCount: ComputedRef<number>;
  activeCount: ComputedRef<number>;
  completedCount: ComputedRef<number>;
  setFilter: (value: TodoFilterType) => void;
  setSearchQuery: (query: string) => void;
}

export function useTodoFilter(items: Ref<ITodoItem[]>): UseTodoFilterReturn {
  const filter = ref<TodoFilterType>('all');
  const searchQuery = ref<string>('');

  const filteredTodos = computed<ITodoItem[]>(() => {
    const normalizedSearch = searchQuery.value.trim().toLowerCase();
    return items.value.filter((item) => {
      const matchesStatus =
        filter.value === 'all' ||
        (filter.value === 'active' && !item.completed) ||
        (filter.value === 'completed' && item.completed);

      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.title.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  });

  const totalCount = computed<number>(() => items.value.length);
  const activeCount = computed<number>(() => items.value.filter((item) => !item.completed).length);
  const completedCount = computed<number>(() => items.value.filter((item) => item.completed).length);

  function setFilter(value: TodoFilterType): void {
    filter.value = value;
  }

  function setSearchQuery(query: string): void {
    searchQuery.value = query;
  }

  return {
    filter,
    searchQuery,
    filteredTodos,
    totalCount,
    activeCount,
    completedCount,
    setFilter,
    setSearchQuery
  };
}
