import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';
import { registerNavigationGuards } from './guards';

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});

registerNavigationGuards(router);

export default router;
