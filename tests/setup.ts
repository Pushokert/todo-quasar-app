import { beforeEach } from 'vitest';
import { config } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { defineComponent, h } from 'vue';

const QInputStub = defineComponent({
  name: 'QInput',
  props: ['modelValue', 'label', 'placeholder', 'error', 'errorMessage', 'outlined', 'dense', 'clearable', 'type'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'q-input-stub' }, [
        h('input', {
          value: props.modelValue,
          placeholder: props.placeholder,
          onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value)
        }),
        props.error && props.errorMessage
          ? h('span', { class: 'q-field-error' }, String(props.errorMessage))
          : null
      ]);
  }
});

const QCheckboxStub = defineComponent({
  name: 'QCheckbox',
  props: ['modelValue', 'color'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        type: 'checkbox',
        class: 'q-checkbox-stub',
        checked: Boolean(props.modelValue),
        onChange: () => emit('update:modelValue', !props.modelValue)
      });
  }
});

const QBtnStub = defineComponent({
  name: 'QBtn',
  props: ['label', 'icon', 'type', 'color', 'flat', 'round', 'dense', 'unelevated'],
  emits: ['click'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'button',
        {
          type: props.type || 'button',
          class: 'q-btn-stub',
          'data-icon': props.icon || '',
          onClick: (e: MouseEvent) => emit('click', e)
        },
        slots.default ? slots.default() : props.label || props.icon || ''
      );
  }
});

const QFormStub = defineComponent({
  name: 'QForm',
  emits: ['submit'],
  setup(_, { emit, slots }) {
    return () =>
      h(
        'form',
        {
          onSubmit: (e: Event) => {
            e.preventDefault();
            emit('submit', e);
          }
        },
        slots.default ? slots.default() : []
      );
  }
});

function simplePassStub(name: string, tag = 'div') {
  return defineComponent({
    name,
    setup(_, { slots }) {
      return () => h(tag, { class: name.toLowerCase() }, slots.default ? slots.default() : []);
    }
  });
}

config.global.stubs = {
  'q-input': QInputStub,
  QInput: QInputStub,
  'q-checkbox': QCheckboxStub,
  QCheckbox: QCheckboxStub,
  'q-btn': QBtnStub,
  QBtn: QBtnStub,
  'q-form': QFormStub,
  QForm: QFormStub,
  'q-item': simplePassStub('QItem'),
  'q-item-section': simplePassStub('QItemSection'),
  'q-item-label': simplePassStub('QItemLabel', 'span'),
  'q-list': simplePassStub('QList'),
  'q-banner': simplePassStub('QBanner'),
  'q-icon': simplePassStub('QIcon', 'i')
};

config.global.directives = {
  ripple: {}
};

beforeEach(() => {
  setActivePinia(createPinia());
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.clear();
  }
});
