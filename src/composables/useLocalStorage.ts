import { ref, watch, type Ref } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T): {
  data: Ref<T>;
  save: () => void;
  reset: () => void;
} {
  const readValue = (): T => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultValue;
    }
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const data = ref<T>(readValue()) as Ref<T>;

  const save = (): void => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(data.value));
    } catch {
      return;
    }
  };

  const reset = (): void => {
    data.value = defaultValue;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  };

  watch(data, () => {
    save();
  }, { deep: true });

  return {
    data,
    save,
    reset
  };
}
