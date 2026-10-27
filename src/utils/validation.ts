export type ValidationRule<T = string> = (value: T) => string | null;

export interface ValidationOutcome {
  valid: boolean;
  errors: string[];
}

const RESERVED_EMAILS = ['taken@example.com', 'blocked@example.com'];

export function requiredRule(fieldName: string): ValidationRule<string> {
  return (value: string): string | null => {
    return value.trim().length > 0 ? null : `Поле "${fieldName}" обязательно для заполнения`;
  };
}

export function minLengthRule(fieldName: string, min: number): ValidationRule<string> {
  return (value: string): string | null => {
    return value.trim().length >= min
      ? null
      : `Поле "${fieldName}" должно содержать не менее ${min} символов`;
  };
}

export function maxLengthRule(fieldName: string, max: number): ValidationRule<string> {
  return (value: string): string | null => {
    return value.trim().length <= max
      ? null
      : `Поле "${fieldName}" не должно превышать ${max} символов`;
  };
}

export function validateEmail(email: string): ValidationOutcome {
  const errors: string[] = [];
  const trimmed = email.trim();
  if (!trimmed) {
    errors.push('Email обязателен для заполнения');
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) {
      errors.push('Введите корректный адрес электронной почты');
    }
  }
  return { valid: errors.length === 0, errors };
}

export function validatePassword(password: string): ValidationOutcome {
  const errors: string[] = [];
  if (password.length < 6) {
    errors.push('Пароль должен содержать минимум 6 символов');
  }
  if (!/[A-Za-zА-Яа-я]/.test(password) || !/\d/.test(password)) {
    errors.push('Пароль должен содержать буквы и цифры');
  }
  return { valid: errors.length === 0, errors };
}

export function validateTodoTitle(title: string): ValidationOutcome {
  const errors: string[] = [];
  const reqErr = requiredRule('Название задачи')(title);
  if (reqErr) {
    errors.push(reqErr);
    return { valid: false, errors };
  }
  const minErr = minLengthRule('Название задачи', 2)(title);
  if (minErr) {
    errors.push(minErr);
  }
  const maxErr = maxLengthRule('Название задачи', 120)(title);
  if (maxErr) {
    errors.push(maxErr);
  }
  return { valid: errors.length === 0, errors };
}

export async function checkEmailUniqueAsync(email: string, delayMs = 20): Promise<ValidationOutcome> {
  const syncResult = validateEmail(email);
  if (!syncResult.valid) {
    return syncResult;
  }
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  const normalized = email.trim().toLowerCase();
  if (RESERVED_EMAILS.includes(normalized)) {
    return {
      valid: false,
      errors: ['Этот адрес электронной почты уже зарегистрирован']
    };
  }
  return { valid: true, errors: [] };
}
