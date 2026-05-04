<script setup>
import { computed } from 'vue'
import { getStatusBadge, getStatusLabel } from '@/utils/helpers'
const props = defineProps({
  status: { type: String, required: true },
  custom: { type: String, default: '' },
  label: { type: String, default: '' },
})
const cls = computed(() => props.custom || getStatusBadge(props.status))
const text = computed(() => props.label || getStatusLabel(props.status))
</script>
<template>
  <span :class="cls">{{ text }}</span>
</template>
