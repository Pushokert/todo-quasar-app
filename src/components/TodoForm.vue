<template>
  <div>
    <FormError
      :message="firstErrorMessage"
      @dismiss="resetValidation"
    />
    <q-form @submit.prevent="handleSubmit" class="row q-col-gutter-sm items-start q-mb-md">
      <div class="col">
        <q-input
          :model-value="fields.title.value"
          outlined
          dense
          label="Новая задача"
          placeholder="Введите название задачи"
          :error="fields.title.dirty && fields.title.errors.length > 0"
          :error-message="fields.title.errors[0] ?? ''"
          @update:model-value="onInput"
        />
      </div>
      <div class="col-auto">
        <q-btn
          type="submit"
          color="primary"
          icon="add"
          label="Добавить"
          unelevated
        />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FormError from './FormError.vue';
import { useValidation } from '../composables/useValidation';
import { validateTodoTitle } from '../utils/validation';

const emit = defineEmits<{
  add: [title: string];
}>();

const { fields, validateAll, setFieldValue, resetValidation } = useValidation({
  title: validateTodoTitle
});

const firstErrorMessage = computed<string>(() => {
  return fields.title.dirty && fields.title.errors.length > 0 ? fields.title.errors[0] : '';
});

async function onInput(val: string | number | null): Promise<void> {
  await setFieldValue('title', String(val ?? ''));
}

async function handleSubmit(): Promise<void> {
  const valid = await validateAll();
  if (!valid) {
    return;
  }
  emit('add', fields.title.value.trim());
  resetValidation();
}
</script>
