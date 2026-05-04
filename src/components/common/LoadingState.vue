<template>
  <div class="flex flex-col items-center justify-center py-16 gap-3">
    <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    <p class="text-slate-400 text-sm">{{ message }}</p>
  </div>
</template>
<script setup>
defineProps({ message: { type: String, default: 'Memuat data...' } })
</script>
