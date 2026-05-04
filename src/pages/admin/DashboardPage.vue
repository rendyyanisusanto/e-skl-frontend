<script setup>
import { ref, onMounted } from 'vue'
import { getDashboard } from '@/services/masterService'
import { getPeriods } from '@/services/masterService'
import { getErrorMessage } from '@/utils/helpers'
import { Users, GraduationCap, XCircle, Clock, FileText, Download, AlertTriangle, BookOpen } from 'lucide-vue-next'

const stats = ref(null)
const loading = ref(true)
const error = ref('')
const periods = ref([])
const selectedPeriod = ref('')

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const params = selectedPeriod.value ? { graduation_period_id: selectedPeriod.value } : {}
    const res = await getDashboard(params)
    stats.value = res.data.data
  } catch (e) { error.value = getErrorMessage(e) } finally { loading.value = false }
}

const cards = [
  { key: 'total_students', label: 'Total Siswa', icon: Users, bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { key: 'total_graduated', label: 'Lulus', icon: GraduationCap, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { key: 'total_not_graduated', label: 'Tidak Lulus', icon: XCircle, bg: 'bg-red-50', text: 'text-red-600' },
  { key: 'total_pending', label: 'Ditunda', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600' },
  { key: 'total_skl_uploaded', label: 'SKL Terupload', icon: FileText, bg: 'bg-blue-50', text: 'text-blue-600' },
  { key: 'total_downloads', label: 'Total Download', icon: Download, bg: 'bg-purple-50', text: 'text-purple-600' },
  { key: 'total_incomplete_requirements', label: 'Syarat Belum Lengkap', icon: AlertTriangle, bg: 'bg-orange-50', text: 'text-orange-600' },
]

onMounted(async () => {
  const r = await getPeriods()
  periods.value = r.data.data.map(p => ({ value: p.id, label: p.name }))
  load()
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p class="text-slate-500 text-sm mt-0.5">Ringkasan data kelulusan siswa</p>
      </div>
      <select v-model="selectedPeriod" @change="load" class="input w-64">
        <option value="">Semua Periode</option>
        <option v-for="p in periods" :key="p.value" :value="p.value">{{ p.label }}</option>
      </select>
    </div>

    <!-- Error -->
    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{{ error }}</div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <template v-if="loading">
        <div v-for="i in 7" :key="i" class="card p-5 animate-pulse">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-slate-100 rounded-xl" />
            <div class="flex-1 space-y-2"><div class="h-4 bg-slate-100 rounded w-3/4" /><div class="h-6 bg-slate-100 rounded w-1/2" /></div>
          </div>
        </div>
      </template>
      <template v-else-if="stats">
        <div v-for="card in cards" :key="card.key" class="stat-card">
          <div :class="['stat-icon', card.bg]">
            <component :is="card.icon" :class="['w-6 h-6', card.text]" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-800">{{ stats[card.key] ?? 0 }}</p>
            <p class="text-slate-500 text-xs mt-0.5">{{ card.label }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
