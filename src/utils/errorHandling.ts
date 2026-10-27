export type ErrorCategory = 'network' | 'business' | 'validation' | 'unknown';

export interface ProcessedErrorInfo {
  category: ErrorCategory;
  userMessage: string;
  canRetry: boolean;
  timestamp: string;
}

export class AppBaseError extends Error {
  public readonly category: ErrorCategory;
  public readonly canRetry: boolean;

  constructor(message: string, category: ErrorCategory, canRetry = false) {
    super(message);
    this.name = 'AppBaseError';
    this.category = category;
    this.canRetry = canRetry;
  }
}

export class ValidationAppError extends AppBaseError {
  constructor(message: string) {
    super(message, 'validation', false);
    this.name = 'ValidationAppError';
  }
}

export class BusinessLogicError extends AppBaseError {
  constructor(message: string) {
    super(message, 'business', false);
    this.name = 'BusinessLogicError';
  }
}

export class NetworkAppError extends AppBaseError {
  constructor(message = 'Ошибка соединения с сервером') {
    super(message, 'network', true);
    this.name = 'NetworkAppError';
  }
}

export interface ErrorStrategy {
  matches(error: unknown): boolean;
  format(error: unknown): ProcessedErrorInfo;
}

const validationStrategy: ErrorStrategy = {
  matches(error: unknown): boolean {
    return error instanceof ValidationAppError;
  },
  format(error: unknown): ProcessedErrorInfo {
    const msg = error instanceof Error ? error.message : 'Проверьте правильность введенных данных';
    return {
      category: 'validation',
      userMessage: msg,
      canRetry: false,
      timestamp: new Date().toISOString()
    };
  }
};

const businessStrategy: ErrorStrategy = {
  matches(error: unknown): boolean {
    return error instanceof BusinessLogicError;
  },
  format(error: unknown): ProcessedErrorInfo {
    const msg = error instanceof Error ? error.message : 'Операция не может быть выполнена';
    return {
      category: 'business',
      userMessage: msg,
      canRetry: false,
      timestamp: new Date().toISOString()
    };
  }
};

const networkStrategy: ErrorStrategy = {
  matches(error: unknown): boolean {
    if (error instanceof NetworkAppError) {
      return true;
    }
    if (error instanceof Error && /network|timeout|fetch|503|502/i.test(error.message)) {
      return true;
    }
    return false;
  },
  format(): ProcessedErrorInfo {
    return {
      category: 'network',
      userMessage: 'Не удалось связаться с сервером. Проверьте подключение и попробуйте снова.',
      canRetry: true,
      timestamp: new Date().toISOString()
    };
  }
};

const strategies: ErrorStrategy[] = [validationStrategy, businessStrategy, networkStrategy];
const errorLogHistory: ProcessedErrorInfo[] = [];

export function classifyAndFormatError(error: unknown): ProcessedErrorInfo {
  for (const strategy of strategies) {
    if (strategy.matches(error)) {
      const formatted = strategy.format(error);
      errorLogHistory.push(formatted);
      return formatted;
    }
  }
  const fallback: ProcessedErrorInfo = {
    category: 'unknown',
    userMessage: 'Произошла непредвиденная ошибка. Пожалуйста, повторите попытку позже.',
    canRetry: false,
    timestamp: new Date().toISOString()
  };
  errorLogHistory.push(fallback);
  return fallback;
}

export function getErrorLogHistory(): ProcessedErrorInfo[] {
  return [...errorLogHistory];
}
