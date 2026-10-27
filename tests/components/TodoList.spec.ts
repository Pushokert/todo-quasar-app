import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoList from '../../src/components/TodoList.vue';
import type { ITodoItem } from '../../src/types/todo';

describe('TodoList.vue component', () => {
  it('отображает баннер при пустом списке задач', () => {
    const wrapper = mount(TodoList, {
      props: { items: [] }
    });

    expect(wrapper.text()).toContain('Нет задач');
  });

  it('рендерит элементы списка и пробрасывает события toggle и delete', async () => {
    const items: ITodoItem[] = [
      { id: 10, title: 'Первая задача', completed: false, createdAt: '2026-10-25T10:00:00.000Z' },
      { id: 20, title: 'Вторая задача', completed: true, createdAt: '2026-10-25T11:00:00.000Z' }
    ];

    const wrapper = mount(TodoList, {
      props: { items }
    });

    expect(wrapper.text()).toContain('Первая задача');
    expect(wrapper.text()).toContain('Вторая задача');

    await wrapper.find('.q-checkbox-stub').trigger('change');
    expect(wrapper.emitted('toggle')?.[0]).toEqual([10]);

    await wrapper.find('.q-btn-stub').trigger('click');
    expect(wrapper.emitted('delete')?.[0]).toEqual([10]);
  });
});
