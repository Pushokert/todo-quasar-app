export * from './todo';
export * from './api';

export type AppRouteName = 'home' | 'settings' | 'login' | 'not-found';

export interface AppRouteMeta {
  requiresAuth?: boolean;
  title: string;
  breadcrumb?: string;
}
