import { describe, it, expect } from 'vitest';
import { useTodoStore } from '../../../src/stores/todoStore';

describe('todoStore Pinia store', () => {
  it('добавляет корректную задачу и отклоняет слишком короткое название', () => {
    const store = useTodoStore();

    const badResult = store.addTodo('a');
    expect(badResult.ok).toBe(false);
    expect(store.items).toHaveLength(0);
    expect(store.lastError?.kind).toBe('VALIDATION_ERROR');

    const okResult = store.addTodo('Сдать практику 10');
    expect(okResult.ok).toBe(true);
    expect(store.items).toHaveLength(1);
    expect(store.stats.total).toBe(1);
    expect(store.stats.active).toBe(1);
  });

  it('переключает статус задачи, возвращает ошибку для несуществующего ID и удаляет задачи', () => {
    const store = useTodoStore();
    const created = store.addTodo('Протестировать store');
    expect(created.ok).toBe(true);
    if (!created.ok) return;

    const id = created.value.id;
    const toggled = store.toggleTodo(id);
    expect(toggled.ok).toBe(true);
    expect(store.stats.completed).toBe(1);

    const missing = store.toggleTodo(999999);
    expect(missing.ok).toBe(false);

    store.clearCompleted();
    expect(store.items).toHaveLength(0);

    const second = store.addTodo('Вторая задача');
    if (second.ok) {
      store.removeTodo(second.value.id);
      expect(store.items).toHaveLength(0);
    }
  });
});
