import { ref, type Ref } from 'vue';
import { apiClient } from '../services/apiClient';
import { useAsync } from './useAsync';

export interface UseApiReturn<T> {
  data: Ref<T | null>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  get: (url: string, useCache?: boolean) => Promise<T | null>;
  cancel: () => void;
}

export function useApi<T>(): UseApiReturn<T> {
  let controller = apiClient.createAbortController();

  const asyncRunner = useAsync<T, [string, boolean]>(async (url: string, useCache: boolean) => {
    controller = apiClient.createAbortController();
    return apiClient.getCached<T>(url, { signal: controller.signal }, useCache);
  });

  const lastUrl = ref<string>('');

  async function get(url: string, useCache = true): Promise<T | null> {
    lastUrl.value = url;
    return asyncRunner.execute(url, useCache);
  }

  function cancel(): void {
    controller.abort();
  }

  return {
    data: asyncRunner.data,
    isLoading: asyncRunner.isLoading,
    error: asyncRunner.error,
    get,
    cancel
  };
}
