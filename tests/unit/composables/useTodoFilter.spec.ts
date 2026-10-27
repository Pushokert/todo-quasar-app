import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useTodoFilter } from '../../../src/composables/useTodoFilter';
import type { ITodoItem } from '../../../src/types/todo';

describe('useTodoFilter composable', () => {
  const createSampleTodos = (): ITodoItem[] => [
    { id: 1, title: 'Купить молоко', completed: false, createdAt: '2026-10-20T10:00:00.000Z' },
    { id: 2, title: 'Написать отчет по практике', completed: true, createdAt: '2026-10-21T10:00:00.000Z' },
    { id: 3, title: 'Подготовить презентацию', completed: false, createdAt: '2026-10-22T10:00:00.000Z' }
  ];

  it('возвращает все задачи по умолчанию и корректно считает статистику', () => {
    const items = ref<ITodoItem[]>(createSampleTodos());
    const filterState = useTodoFilter(items);

    expect(filterState.totalCount.value).toBe(3);
    expect(filterState.activeCount.value).toBe(2);
    expect(filterState.completedCount.value).toBe(1);
    expect(filterState.filteredTodos.value).toHaveLength(3);
  });

  it('фильтрует только активные и только выполненные задачи', () => {
    const items = ref<ITodoItem[]>(createSampleTodos());
    const filterState = useTodoFilter(items);

    filterState.setFilter('active');
    expect(filterState.filteredTodos.value.map((t) => t.id)).toEqual([1, 3]);

    filterState.setFilter('completed');
    expect(filterState.filteredTodos.value.map((t) => t.id)).toEqual([2]);
  });

  it('выполняет поиск задач по подстроке без учета регистра', () => {
    const items = ref<ITodoItem[]>(createSampleTodos());
    const filterState = useTodoFilter(items);

    filterState.setSearchQuery('ОТЧЕТ');
    expect(filterState.filteredTodos.value).toHaveLength(1);
    expect(filterState.filteredTodos.value[0].id).toBe(2);
  });
});
