import { computed, ref, type App, type ComputedRef, type Ref } from 'vue';
import { classifyAndFormatError, type ProcessedErrorInfo } from '../utils/errorHandling';

const activeError = ref<ProcessedErrorInfo | null>(null);
let lastRetryAction: (() => Promise<void> | void) | null = null;

export interface UseErrorHandlerReturn {
  currentError: Ref<ProcessedErrorInfo | null>;
  userMessage: ComputedRef<string>;
  canRetry: ComputedRef<boolean>;
  captureError: (error: unknown, retryFn?: () => Promise<void> | void) => ProcessedErrorInfo;
  retry: () => Promise<void>;
  clearError: () => void;
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const userMessage = computed<string>(() => activeError.value?.userMessage ?? '');
  const canRetry = computed<boolean>(() => Boolean(activeError.value?.canRetry && lastRetryAction));

  function captureError(error: unknown, retryFn?: () => Promise<void> | void): ProcessedErrorInfo {
    const info = classifyAndFormatError(error);
    activeError.value = info;
    lastRetryAction = retryFn ?? null;
    return info;
  }

  async function retry(): Promise<void> {
    if (!lastRetryAction) {
      return;
    }
    const action = lastRetryAction;
    clearError();
    await action();
  }

  function clearError(): void {
    activeError.value = null;
    lastRetryAction = null;
  }

  return {
    currentError: activeError,
    userMessage,
    canRetry,
    captureError,
    retry,
    clearError
  };
}

export function registerGlobalErrorHandler(app: App): void {
  const { captureError } = useErrorHandler();
  app.config.errorHandler = (err: unknown): void => {
    captureError(err);
  };
}
