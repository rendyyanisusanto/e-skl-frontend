<script setup>
import { ref, onMounted } from 'vue'
import { getDownloadLogs } from '@/services/masterService'
import { getErrorMessage } from '@/utils/helpers'
import { formatDateTime } from '@/utils/formatDate'

const data = ref({ data: [], total: 0, page: 1, limit: 20 })
const loading = ref(true)
const error = ref('')
const filters = ref({ date_from: '', date_to: '', search: '', page: 1, limit: 20 })

const load = async () => { loading.value = true; try { const r = await getDownloadLogs(filters.value); data.value = r.data.data } catch (e) { error.value = getErrorMessage(e) } finally { loading.value = false } }
const changePage = (p) => { filters.value.page = p; load() }
onMounted(load)
</script>
<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div><h1 class="text-2xl font-bold text-slate-800">Log Download</h1><p class="text-slate-500 text-sm">Riwayat download SKL siswa</p></div>
    </div>
    <div class="flex flex-wrap gap-3 mb-4">
      <input v-model="filters.date_from" @change="load" type="date" class="input w-40" placeholder="Dari" />
      <input v-model="filters.date_to" @change="load" type="date" class="input w-40" placeholder="Sampai" />
      <input v-model="filters.search" @input="load" class="input w-56" placeholder="Cari nama/NISN..." />
    </div>
    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{{ error }}</div>
    <div class="card overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 border-b border-slate-200"><tr><th class="table-th">Nama Siswa</th><th class="table-th">NISN</th><th class="table-th">Kode Verifikasi</th><th class="table-th">IP Address</th><th class="table-th">Waktu Download</th></tr></thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-if="loading"><td colspan="5" class="text-center py-10 text-slate-400">Memuat...</td></tr>
          <tr v-else-if="!data.data.length"><td colspan="5" class="text-center py-10 text-slate-400">Belum ada log.</td></tr>
          <tr v-for="l in data.data" :key="l.id" class="hover:bg-slate-50">
            <td class="table-td font-medium text-slate-800">{{ l.student?.name || '-' }}</td>
            <td class="table-td text-slate-500">{{ l.student?.nisn || '-' }}</td>
            <td class="table-td font-mono text-xs text-indigo-600">{{ l.sklDocument?.verificationCode || l.skl_document?.verification_code || '-' }}</td>
            <td class="table-td text-slate-400 text-xs">{{ l.ipAddress || l.ip_address || '-' }}</td>
            <td class="table-td text-slate-500 text-xs">{{ formatDateTime(l.downloadedAt || l.downloaded_at) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="data.total > data.limit" class="flex justify-between items-center px-4 py-3 border-t border-slate-100">
        <p class="text-sm text-slate-500">{{ data.total }} log</p>
        <div class="flex gap-1"><button @click="changePage(data.page-1)" :disabled="data.page<=1" class="btn-secondary btn-sm">←</button><button @click="changePage(data.page+1)" :disabled="data.page*data.limit>=data.total" class="btn-secondary btn-sm">→</button></div>
      </div>
    </div>
  </div>
</template>
