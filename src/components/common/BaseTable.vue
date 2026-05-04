<script setup>
defineProps({
  columns: { type: Array, default: () => [] }, // [{ key, label, class }]
  loading: { type: Boolean, default: false },
  empty: { type: Boolean, default: false },
  emptyMessage: { type: String, default: 'Tidak ada data.' },
})
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-slate-200">
    <table class="w-full text-sm">
      <thead class="bg-slate-50 border-b border-slate-200">
        <tr>
          <th v-for="col in columns" :key="col.key" :class="['table-th', col.class || '']">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 bg-white">
        <template v-if="loading">
          <tr v-for="i in 5" :key="i">
            <td :colspan="columns.length" class="table-td"><div class="h-4 bg-slate-100 rounded animate-pulse" /></td>
          </tr>
        </template>
        <template v-else-if="empty">
          <tr>
            <td :colspan="columns.length" class="text-center py-12 text-slate-400">
              <div class="flex flex-col items-center gap-2">
                <svg class="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span class="text-sm">{{ emptyMessage }}</span>
              </div>
            </td>
          </tr>
        </template>
        <template v-else>
          <slot />
        </template>
      </tbody>
    </table>
  </div>
</template>
