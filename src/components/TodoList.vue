<template>
  <div>
    <q-banner v-if="items.length === 0" rounded class="bg-grey-2 text-grey-7 text-center q-pa-lg">
      Нет задач, соответствующих выбранному фильтру.
    </q-banner>

    <q-list v-else bordered separator class="rounded-borders">
      <transition-group
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <TodoItem
          v-for="item in items"
          :key="item.id"
          :todo="item"
          @toggle="emit('toggle', $event)"
          @delete="emit('delete', $event)"
        />
      </transition-group>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import type { ITodoItem } from '../types/todo';
import TodoItem from './TodoItem.vue';

defineProps<{
  items: ITodoItem[];
}>();

const emit = defineEmits<{
  toggle: [id: number];
  delete: [id: number];
}>();
</script>
