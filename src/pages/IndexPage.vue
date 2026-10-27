<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-banner
          v-for="note in uiStore.notifications"
          :key="note.id"
          rounded
          dense
          class="q-mb-sm bg-blue-1 text-primary"
        >
          <div class="row items-center justify-between">
            <span>{{ note.message }}</span>
            <q-btn flat dense round icon="close" @click="uiStore.dismissNotification(note.id)" />
          </div>
        </q-banner>

        <q-card flat bordered class="q-pa-md">
          <q-card-section class="row items-center justify-between q-col-gutter-sm">
            <div>
              <div class="text-h5 text-weight-bold">Список задач</div>
              <div class="text-caption text-grey-7">
                Всего: {{ todoStore.stats.total }} | Активных: {{ todoStore.stats.active }} | Выполненных: {{ todoStore.stats.completed }}
              </div>
            </div>
            <q-btn-toggle
              v-model="todoStore.filter"
              toggle-color="primary"
              unelevated
              rounded
              :options="filterOptions"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              v-model="todoStore.searchQuery"
              outlined
              dense
              clearable
              placeholder="Поиск задач по названию"
              class="q-mb-md"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <TodoForm @add="todoStore.addTodo" />

            <TodoList
              :items="todoStore.filteredTodos"
              @toggle="todoStore.toggleTodo"
              @delete="todoStore.removeTodo"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import TodoForm from '../components/TodoForm.vue';
import TodoList from '../components/TodoList.vue';
import { useTodoStore, useUiStore } from '../stores';
import type { TodoFilterType } from '../types';

const todoStore = useTodoStore();
const uiStore = useUiStore();

const filterOptions: Array<{ label: string; value: TodoFilterType }> = [
  { label: 'Все', value: 'all' },
  { label: 'Активные', value: 'active' },
  { label: 'Выполненные', value: 'completed' }
];
</script>
