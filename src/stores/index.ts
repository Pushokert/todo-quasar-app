import { createPinia, type Pinia } from 'pinia';

export function setupStores(): Pinia {
  return createPinia();
}

export * from './todoStore';
export * from './uiStore';
export * from './userStore';
