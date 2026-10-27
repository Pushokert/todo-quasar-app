import { computed, reactive, type ComputedRef } from 'vue';
import type { ValidationOutcome } from '../utils/validation';
import { createFieldState, type FormFieldState } from '../utils/formHelpers';

export type ValidatorFn = (value: string) => ValidationOutcome | Promise<ValidationOutcome>;

export interface UseValidationReturn<K extends string> {
  fields: Record<K, FormFieldState>;
  isValid: ComputedRef<boolean>;
  validateField: (key: K) => Promise<boolean>;
  validateAll: () => Promise<boolean>;
  setFieldValue: (key: K, value: string) => Promise<void>;
  resetValidation: () => void;
}

export function useValidation<K extends string>(
  validators: Record<K, ValidatorFn>,
  initialValues?: Partial<Record<K, string>>
): UseValidationReturn<K> {
  const keys = Object.keys(validators) as K[];
  const rawState = {} as Record<K, FormFieldState>;

  for (const key of keys) {
    rawState[key] = createFieldState(initialValues?.[key] ?? '');
  }

  const fields = reactive(rawState) as Record<K, FormFieldState>;

  async function validateField(key: K): Promise<boolean> {
    const field = fields[key];
    field.dirty = true;
    const outcome = await validators[key](field.value);
    field.errors = outcome.errors;
    return outcome.valid;
  }

  async function validateAll(): Promise<boolean> {
    const results = await Promise.all(keys.map((key) => validateField(key)));
    return results.every(Boolean);
  }

  async function setFieldValue(key: K, value: string): Promise<void> {
    fields[key].value = value;
    await validateField(key);
  }

  function resetValidation(): void {
    for (const key of keys) {
      fields[key].value = initialValues?.[key] ?? '';
      fields[key].dirty = false;
      fields[key].errors = [];
    }
  }

  const isValid = computed<boolean>(() => {
    return keys.every((key) => fields[key].errors.length === 0);
  });

  return {
    fields,
    isValid,
    validateField,
    validateAll,
    setFieldValue,
    resetValidation
  };
}
