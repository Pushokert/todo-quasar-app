import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useLocalStorage } from '../composables/useLocalStorage';

export type AppTheme = 'light' | 'dark';

export interface UiNotification {
  id: number;
  message: string;
  type: 'positive' | 'negative' | 'info';
}

export const useUiStore = defineStore('ui', () => {
  const { data: theme } = useLocalStorage<AppTheme>('quasar_ui_theme', 'light');
  const isDrawerOpen = ref<boolean>(true);
  const isFilterPanelOpen = ref<boolean>(true);
  const notifications = ref<UiNotification[]>([]);

  const isDarkTheme = computed<boolean>(() => theme.value === 'dark');

  function toggleTheme(): void {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  }

  function setTheme(nextTheme: AppTheme): void {
    theme.value = nextTheme;
  }

  function toggleDrawer(): void {
    isDrawerOpen.value = !isDrawerOpen.value;
  }

  function toggleFilterPanel(): void {
    isFilterPanelOpen.value = !isFilterPanelOpen.value;
  }

  function pushNotification(message: string, type: UiNotification['type'] = 'info'): void {
    notifications.value.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      message,
      type
    });
  }

  function dismissNotification(id: number): void {
    notifications.value = notifications.value.filter((item) => item.id !== id);
  }

  return {
    theme,
    isDarkTheme,
    isDrawerOpen,
    isFilterPanelOpen,
    notifications,
    toggleTheme,
    setTheme,
    toggleDrawer,
    toggleFilterPanel,
    pushNotification,
    dismissNotification
  };
});
