<template>
  <div class="flex flex-col items-center justify-center py-16 gap-3">
    <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
      <svg class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
    </div>
    <div class="text-center">
      <p class="text-slate-700 font-medium">Terjadi Kesalahan</p>
      <p class="text-slate-400 text-sm mt-1">{{ message }}</p>
    </div>
    <button v-if="onRetry" @click="onRetry" class="btn-secondary btn-sm">Coba Lagi</button>
  </div>
</template>
<script setup>
defineProps({ message: { type: String, default: 'Gagal memuat data.' }, onRetry: { type: Function, default: null } })
</script>
