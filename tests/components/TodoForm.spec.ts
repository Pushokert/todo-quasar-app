import { describe, it, expect } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import TodoForm from '../../src/components/TodoForm.vue';

describe('TodoForm.vue component', () => {
  it('блокирует отправку пустой задачи и отображает сообщение об ошибке', async () => {
    const wrapper = mount(TodoForm);

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.emitted('add')).toBeUndefined();
    expect(wrapper.text()).toContain('обязательно для заполнения');
  });

  it('отправляет валидную задачу и очищает поле ввода', async () => {
    const wrapper = mount(TodoForm);
    const input = wrapper.find('input');

    await input.setValue('Новая задача из теста');
    await flushPromises();
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.emitted('add')?.[0]).toEqual(['Новая задача из теста']);
    expect((input.element as HTMLInputElement).value).toBe('');
  });
});
