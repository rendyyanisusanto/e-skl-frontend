<script setup>
import { ref, onMounted } from 'vue'
import { getVerificationLogs } from '@/services/masterService'
import { getErrorMessage } from '@/utils/helpers'
import { formatDateTime } from '@/utils/formatDate'

const data = ref({ data: [], total: 0, page: 1, limit: 20 })
const loading = ref(true)
const error = ref('')
const filters = ref({ search: '', page: 1, limit: 20 })

const load = async () => { loading.value = true; try { const r = await getVerificationLogs(filters.value); data.value = r.data.data } catch (e) { error.value = getErrorMessage(e) } finally { loading.value = false } }
const changePage = (p) => { filters.value.page = p; load() }
onMounted(load)
</script>
<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div><h1 class="text-2xl font-bold text-slate-800">Log Verifikasi</h1><p class="text-slate-500 text-sm">Riwayat pengecekan kode SKL</p></div>
    </div>
    <div class="flex gap-3 mb-4">
      <input v-model="filters.search" @input="load" class="input w-56" placeholder="Cari kode verifikasi..." />
    </div>
    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{{ error }}</div>
    <div class="card overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 border-b border-slate-200"><tr><th class="table-th">Kode Verifikasi</th><th class="table-th">No. Dokumen</th><th class="table-th">IP Address</th><th class="table-th">Waktu Cek</th></tr></thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-if="loading"><td colspan="4" class="text-center py-10 text-slate-400">Memuat...</td></tr>
          <tr v-else-if="!data.data.length"><td colspan="4" class="text-center py-10 text-slate-400">Belum ada log.</td></tr>
          <tr v-for="l in data.data" :key="l.id" class="hover:bg-slate-50">
            <td class="table-td font-mono text-xs text-indigo-600 font-bold">{{ l.verificationCode || l.verification_code }}</td>
            <td class="table-td text-slate-500">{{ l.sklDocument?.documentNumber || '-' }}</td>
            <td class="table-td text-slate-400 text-xs">{{ l.ipAddress || l.ip_address || '-' }}</td>
            <td class="table-td text-slate-500 text-xs">{{ formatDateTime(l.checkedAt || l.checked_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
