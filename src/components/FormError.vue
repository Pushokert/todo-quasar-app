<template>
  <q-banner
    v-if="message"
    rounded
    dense
    class="bg-red-1 text-negative q-mb-md"
  >
    <div class="row items-center justify-between q-col-gutter-sm">
      <div class="col">{{ message }}</div>
      <div class="col-auto row q-gutter-xs">
        <q-btn
          v-if="canRetry"
          flat
          dense
          color="negative"
          icon="refresh"
          label="Повторить"
          @click="emit('retry')"
        />
        <q-btn
          flat
          dense
          round
          color="negative"
          icon="close"
          @click="emit('dismiss')"
        />
      </div>
    </div>
  </q-banner>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
  canRetry?: boolean;
}>();

const emit = defineEmits<{
  retry: [];
  dismiss: [];
}>();
</script>
