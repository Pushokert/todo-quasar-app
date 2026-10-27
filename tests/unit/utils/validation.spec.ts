import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateTodoTitle,
  checkEmailUniqueAsync
} from '../../../src/utils/validation';
import {
  ValidationAppError,
  BusinessLogicError,
  NetworkAppError,
  classifyAndFormatError,
  getErrorLogHistory
} from '../../../src/utils/errorHandling';

describe('validation and errorHandling utilities', () => {
  it('корректно валидирует email, пароль и название задачи', () => {
    expect(validateEmail('').valid).toBe(false);
    expect(validateEmail('invalid-email').valid).toBe(false);
    expect(validateEmail('user@example.com').valid).toBe(true);

    expect(validatePassword('123').valid).toBe(false);
    expect(validatePassword('onlyletters').valid).toBe(false);
    expect(validatePassword('Pass123').valid).toBe(true);

    expect(validateTodoTitle('').valid).toBe(false);
    expect(validateTodoTitle('x').valid).toBe(false);
    expect(validateTodoTitle('x'.repeat(130)).valid).toBe(false);
    expect(validateTodoTitle('Корректная задача').valid).toBe(true);
  });

  it('выполняет асинхронную проверку уникальности email', async () => {
    const reserved = await checkEmailUniqueAsync('taken@example.com', 1);
    expect(reserved.valid).toBe(false);

    const free = await checkEmailUniqueAsync('free@example.com', 1);
    expect(free.valid).toBe(true);
  });

  it('классифицирует ошибки валидации, бизнес-логики и сети', () => {
    const vInfo = classifyAndFormatError(new ValidationAppError('Некорректное поле'));
    expect(vInfo.category).toBe('validation');
    expect(vInfo.canRetry).toBe(false);

    const bInfo = classifyAndFormatError(new BusinessLogicError('Лимит задач превышен'));
    expect(bInfo.category).toBe('business');

    const nInfo = classifyAndFormatError(new NetworkAppError());
    expect(nInfo.category).toBe('network');
    expect(nInfo.canRetry).toBe(true);

    const uInfo = classifyAndFormatError(new Error('Unknown crash'));
    expect(uInfo.category).toBe('unknown');
    expect(getErrorLogHistory().length).toBeGreaterThanOrEqual(4);
  });
});
