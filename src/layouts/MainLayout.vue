<template>
  <q-layout view="lHh Lpr lFf" :class="uiStore.isDarkTheme ? 'bg-grey-10 text-white' : 'bg-grey-1 text-dark'">
    <q-header elevated :class="uiStore.isDarkTheme ? 'bg-grey-9 text-white' : 'bg-primary text-white'">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="uiStore.toggleDrawer" />
        <q-toolbar-title>ToDo Приложение</q-toolbar-title>
        <div class="q-mr-md text-subtitle2">{{ userStore.displayName }}</div>
        <q-btn
          flat
          dense
          round
          :icon="uiStore.isDarkTheme ? 'light_mode' : 'dark_mode'"
          @click="uiStore.toggleTheme"
        />
        <q-btn flat dense round icon="logout" aria-label="Выйти" @click="handleLogout" />
      </q-toolbar>

      <q-toolbar inset class="bg-white text-primary q-py-xs">
        <q-breadcrumbs active-color="primary">
          <q-breadcrumbs-el icon="home" label="Главная" to="/" />
          <q-breadcrumbs-el v-if="currentBreadcrumb" :label="currentBreadcrumb" />
        </q-breadcrumbs>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="uiStore.isDrawerOpen" show-if-above bordered>
      <q-list padding>
        <q-item-label header class="text-weight-bold">Разделы</q-item-label>
        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar>
            <q-icon name="check_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Список задач</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/settings">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Настройки</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUiStore, useUserStore } from '../stores';

const uiStore = useUiStore();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const currentBreadcrumb = computed<string>(() => {
  const crumb = route.meta?.breadcrumb;
  return typeof crumb === 'string' ? crumb : '';
});

async function handleLogout(): Promise<void> {
  userStore.logout();
  await router.push('/login');
}
</script>
