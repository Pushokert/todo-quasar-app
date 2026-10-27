import { describe, it, expect } from 'vitest';
import { useValidation } from '../../../src/composables/useValidation';
import { validateEmail, validateTodoTitle } from '../../../src/utils/validation';

describe('useValidation composable', () => {
  it('проверяет поля и отмечает ошибки при некорректном вводе', async () => {
    const form = useValidation({
      title: validateTodoTitle,
      email: validateEmail
    });

    const valid = await form.validateAll();
    expect(valid).toBe(false);
    expect(form.isValid.value).toBe(false);
    expect(form.fields.title.errors.length).toBeGreaterThan(0);
    expect(form.fields.email.errors.length).toBeGreaterThan(0);
  });

  it('успешно проходит валидацию при корректных значениях и сбрасывает состояние', async () => {
    const form = useValidation({
      title: validateTodoTitle,
      email: validateEmail
    });

    await form.setFieldValue('title', 'Проверить модульные тесты');
    await form.setFieldValue('email', 'student@example.com');

    expect(form.isValid.value).toBe(true);
    const allOk = await form.validateAll();
    expect(allOk).toBe(true);

    form.resetValidation();
    expect(form.fields.title.value).toBe('');
    expect(form.fields.title.dirty).toBe(false);
  });
});
