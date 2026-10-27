import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true, title: 'Главная', breadcrumb: 'Список задач' },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../pages/IndexPage.vue'),
        meta: { requiresAuth: true, title: 'Список задач', breadcrumb: 'Задачи' }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../pages/SettingsPage.vue'),
        meta: { requiresAuth: true, title: 'Настройки', breadcrumb: 'Настройки' }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('../pages/LoginPage.vue'),
        meta: { requiresAuth: false, title: 'Вход', breadcrumb: 'Вход' }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'not-found',
        component: () => import('../pages/NotFoundPage.vue'),
        meta: { requiresAuth: false, title: 'Страница не найдена', breadcrumb: '404' }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    redirect: '/404'
  }
];

export default routes;
