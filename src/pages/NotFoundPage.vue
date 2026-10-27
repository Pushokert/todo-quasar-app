<template>
  <q-page class="row items-center justify-center q-pa-xl text-center">
    <div>
      <div class="text-h2 text-weight-bold text-primary q-mb-sm">404</div>
      <div class="text-h5 q-mb-md">Страница не найдена</div>
      <q-btn color="primary" unelevated label="Вернуться на главную" @click="goHome" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

async function goHome(): Promise<void> {
  await router.push('/');
}
</script>
