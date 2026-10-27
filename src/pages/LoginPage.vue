<template>
  <q-page class="row items-center justify-center q-pa-md">
    <q-card flat bordered class="col-12 col-sm-8 col-md-4 q-pa-lg">
      <q-card-section>
        <div class="text-h5 text-weight-bold">Вход в систему</div>
        <div class="text-caption text-grey-7">Введите учетные данные для доступа к задачам</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="email"
            outlined
            label="Email"
            type="email"
            :error="Boolean(userStore.authError)"
          />
          <q-input
            v-model="password"
            outlined
            label="Пароль"
            type="password"
            :error="Boolean(userStore.authError)"
            :error-message="userStore.authError ?? ''"
          />
          <q-btn
            type="submit"
            color="primary"
            label="Войти"
            unelevated
            class="full-width"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const email = ref<string>('ivan@example.com');
const password = ref<string>('123456');

async function onSubmit(): Promise<void> {
  const ok = userStore.login(email.value, password.value);
  if (ok) {
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/';
    await router.push(redirect);
  }
}
</script>
