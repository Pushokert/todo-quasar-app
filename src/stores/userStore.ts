import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useLocalStorage } from '../composables/useLocalStorage';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export interface UserSettings {
  compactMode: boolean;
  itemsPerPage: number;
  emailNotifications: boolean;
}

export const useUserStore = defineStore('user', () => {
  const { data: currentUser, reset: clearUser } = useLocalStorage<UserProfile | null>('quasar_user_profile', {
    id: 1,
    name: 'Иван Петров',
    email: 'ivan@example.com'
  });

  const { data: settings } = useLocalStorage<UserSettings>('quasar_user_settings', {
    compactMode: false,
    itemsPerPage: 10,
    emailNotifications: true
  });

  const authError = ref<string | null>(null);
  const isAuthenticated = computed<boolean>(() => currentUser.value !== null);
  const displayName = computed<string>(() => currentUser.value?.name ?? 'Гость');

  function login(email: string, password: string): boolean {
    if (!email.includes('@') || password.trim().length < 4) {
      authError.value = 'Неверный email или пароль';
      return false;
    }
    authError.value = null;
    currentUser.value = {
      id: 1,
      name: email.split('@')[0] || 'Пользователь',
      email: email.trim()
    };
    return true;
  }

  function logout(): void {
    clearUser();
    currentUser.value = null;
  }

  function updateSettings(patch: Partial<UserSettings>): void {
    settings.value = {
      ...settings.value,
      ...patch
    };
  }

  return {
    currentUser,
    settings,
    authError,
    isAuthenticated,
    displayName,
    login,
    logout,
    updateSettings
  };
});
