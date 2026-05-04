<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <label v-if="label" class="label">{{ label }}<span v-if="required" class="text-red-500 ml-1">*</span></label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :class="['input', error ? 'border-red-400 focus:ring-red-400' : '']"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
  </div>
</template>
