import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url)),
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
      layouts: fileURLToPath(new URL('./src/layouts', import.meta.url)),
      pages: fileURLToPath(new URL('./src/pages', import.meta.url)),
      stores: fileURLToPath(new URL('./src/stores', import.meta.url)),
      router: fileURLToPath(new URL('./src/router', import.meta.url))
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/composables/useTodoFilter.ts',
        'src/composables/useValidation.ts',
        'src/stores/todoStore.ts',
        'src/utils/validation.ts',
        'src/utils/errorHandling.ts',
        'src/components/TodoItem.vue',
        'src/components/TodoForm.vue',
        'src/components/TodoList.vue'
      ]
    }
  }
});
