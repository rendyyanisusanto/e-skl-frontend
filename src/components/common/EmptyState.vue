<template>
  <div class="flex flex-col items-center justify-center py-16 gap-3">
    <div class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
      <svg class="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
    </div>
    <div class="text-center">
      <p class="text-slate-600 font-medium">{{ title }}</p>
      <p v-if="description" class="text-slate-400 text-sm mt-1">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>
<script setup>
defineProps({ title: { type: String, default: 'Tidak ada data' }, description: { type: String, default: '' } })
</script>
