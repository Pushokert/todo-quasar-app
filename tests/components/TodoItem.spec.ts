import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoItem from '../../src/components/TodoItem.vue';
import type { ITodoItem } from '../../src/types/todo';

describe('TodoItem.vue component', () => {
  const sampleTodo: ITodoItem = {
    id: 42,
    title: 'Подготовить тесты компонента',
    completed: true,
    createdAt: '2026-10-25T12:00:00.000Z'
  };

  it('отображает название задачи, дату в формате DD/MM/YYYY и стили выполненной задачи', () => {
    const wrapper = mount(TodoItem, {
      props: { todo: sampleTodo }
    });

    expect(wrapper.text()).toContain('Подготовить тесты компонента');
    expect(wrapper.text()).toContain('25/10/2026');
    expect(wrapper.html()).toContain('text-strike');
  });

  it('эмитит события toggle и delete с ID задачи', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: sampleTodo }
    });

    await wrapper.find('.q-checkbox-stub').trigger('change');
    expect(wrapper.emitted('toggle')?.[0]).toEqual([42]);

    await wrapper.find('.q-btn-stub').trigger('click');
    expect(wrapper.emitted('delete')?.[0]).toEqual([42]);
  });
});
