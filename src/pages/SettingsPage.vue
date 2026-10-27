<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="q-pa-md">
          <q-card-section>
            <div class="text-h5 text-weight-bold">Настройки приложения</div>
            <div class="text-caption text-grey-7">Пользователь: {{ userStore.displayName }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-gutter-sm">
            <div>
              <q-toggle
                :model-value="uiStore.isDarkTheme"
                label="Темная тема оформления"
                @update:model-value="uiStore.toggleTheme"
              />
            </div>
            <div>
              <q-toggle
                v-model="userStore.settings.compactMode"
                label="Компактный режим списка"
              />
            </div>
            <div>
              <q-toggle
                v-model="userStore.settings.emailNotifications"
                label="Уведомления по электронной почте"
              />
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat color="primary" label="На главную" @click="goHome" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUiStore, useUserStore } from '../stores';

const uiStore = useUiStore();
const userStore = useUserStore();
const router = useRouter();

async function goHome(): Promise<void> {
  await router.push('/');
}
</script>
