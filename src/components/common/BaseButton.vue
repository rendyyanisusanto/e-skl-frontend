<script setup>
const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary, secondary, danger, success
  size: { type: String, default: '' },            // sm, lg, ''
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      `btn-${variant}`,
      size ? `btn-${size}` : '',
    ]"
  >
    <span
      v-if="loading"
      class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
    />
    <slot />
  </button>
</template>
