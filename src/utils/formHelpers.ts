export interface FormFieldState {
  value: string;
  dirty: boolean;
  errors: string[];
}

export function createFieldState(initialValue = ''): FormFieldState {
  return {
    value: initialValue,
    dirty: false,
    errors: []
  };
}

export function getFirstError(state: FormFieldState): string {
  return state.errors[0] ?? '';
}

export function hasFieldError(state: FormFieldState): boolean {
  return state.dirty && state.errors.length > 0;
}
