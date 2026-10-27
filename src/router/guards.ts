import type { Router } from 'vue-router';
import { useUserStore } from '../stores/userStore';

export function registerNavigationGuards(router: Router): void {
  router.beforeEach((to) => {
    const userStore = useUserStore();
    const requiresAuth = Boolean(to.meta?.requiresAuth);

    if (typeof document !== 'undefined' && typeof to.meta?.title === 'string') {
      document.title = `ToDo - ${to.meta.title}`;
    }

    if (requiresAuth && !userStore.isAuthenticated) {
      return {
        path: '/login',
        query: { redirect: to.fullPath }
      };
    }

    if (to.path === '/login' && userStore.isAuthenticated) {
      return { path: '/' };
    }

    return true;
  });
}
