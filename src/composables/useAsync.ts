import { ref, type Ref } from 'vue';

export interface UseAsyncReturn<T, Args extends unknown[]> {
  data: Ref<T | null>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  execute: (...args: Args) => Promise<T | null>;
}

export function useAsync<T, Args extends unknown[] = []>(
  asyncFn: (...args: Args) => Promise<T>
): UseAsyncReturn<T, Args> {
  const data = ref<T | null>(null) as Ref<T | null>;
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  async function execute(...args: Args): Promise<T | null> {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await asyncFn(...args);
      data.value = result;
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка выполнения запроса';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    data,
    isLoading,
    error,
    execute
  };
}
