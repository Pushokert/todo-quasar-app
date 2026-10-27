<template>
  <q-item class="q-py-sm" :class="todo.completed ? 'bg-grey-2 text-grey-6' : ''">
    <q-item-section avatar>
      <q-checkbox
        :model-value="todo.completed"
        color="primary"
        @update:model-value="emit('toggle', todo.id)"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="todo.completed ? 'text-strike text-grey-6' : 'text-body1'">
        {{ todo.title }}
      </q-item-label>
      <q-item-label caption>
        Создано: {{ formattedDate }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-btn
        flat
        round
        dense
        color="negative"
        icon="delete"
        aria-label="Удалить задачу"
        @click="emit('delete', todo.id)"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ITodoItem } from '../types/todo';

const props = defineProps<{
  todo: ITodoItem;
}>();

const emit = defineEmits<{
  toggle: [id: number];
  delete: [id: number];
}>();

const formattedDate = computed<string>(() => {
  const date = new Date(props.todo.createdAt);
  if (Number.isNaN(date.getTime())) {
    return props.todo.createdAt;
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
});
</script>
