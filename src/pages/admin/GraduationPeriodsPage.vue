<script setup>
import { ref, onMounted } from 'vue'
import { getPeriods, createPeriod, updatePeriod, deletePeriod } from '@/services/masterService'
import { getErrorMessage } from '@/utils/helpers'
import { formatDate, formatDateTime, formatDateTimeInput } from '@/utils/formatDate'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import { Plus, Pencil, PowerOff, Globe } from 'lucide-vue-next'

const periods = ref([])
const loading = ref(true)
const error = ref('')
const showModal = ref(false)
const saving = ref(false)
const editTarget = ref(null)
const toast = ref('')

const form = ref({ academic_year: '', name: '', announcement_date: '', download_start_at: '', download_end_at: '', is_published: false })

const load = async () => {
  loading.value = true
  try { const r = await getPeriods(); periods.value = r.data.data }
  catch (e) { error.value = getErrorMessage(e) }
  finally { loading.value = false }
}

const openCreate = () => { editTarget.value = null; form.value = { academic_year: '', name: '', announcement_date: '', download_start_at: '', download_end_at: '', is_published: false }; showModal.value = true }
const openEdit = (p) => {
  editTarget.value = p
  form.value = { academic_year: p.academicYear || p.academic_year, name: p.name, announcement_date: formatDateTimeInput(p.announcementDate || p.announcement_date), download_start_at: formatDateTimeInput(p.downloadStartAt || p.download_start_at), download_end_at: formatDateTimeInput(p.downloadEndAt || p.download_end_at), is_published: p.isPublished ?? p.is_published }
  showModal.value = true
}

const save = async () => {
  saving.value = true
  try {
    if (editTarget.value) await updatePeriod(editTarget.value.id, form.value)
    else await createPeriod(form.value)
    showModal.value = false
    toast.value = 'Periode berhasil disimpan.'
    setTimeout(() => toast.value = '', 3000)
    load()
  } catch (e) { error.value = getErrorMessage(e) } finally { saving.value = false }
}

const togglePublish = async (p) => {
  try {
    await updatePeriod(p.id, { is_published: !(p.isPublished ?? p.is_published) })
    toast.value = 'Status publish diperbarui.'
    setTimeout(() => toast.value = '', 3000)
    load()
  } catch (e) { error.value = getErrorMessage(e) }
}

const deactivate = async (id) => {
  if (!confirm('Nonaktifkan periode ini?')) return
  try { await deletePeriod(id); load() } catch (e) { error.value = getErrorMessage(e) }
}

onMounted(load)
</script>

<template>
  <div>
    <!-- Toast -->
    <Transition name="fade">
      <div v-if="toast" class="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">{{ toast }}</div>
    </Transition>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div><h1 class="text-2xl font-bold text-slate-800">Periode Kelulusan</h1><p class="text-slate-500 text-sm">Kelola periode kelulusan siswa</p></div>
      <button @click="openCreate" class="btn-primary"><Plus class="w-4 h-4" />Tambah Periode</button>
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{{ error }}</div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="table-th">Nama Periode</th><th class="table-th">Tahun Ajaran</th><th class="table-th">Status</th><th class="table-th">Publish</th><th class="table-th">Pengumuman</th><th class="table-th">Download</th><th class="table-th">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <tr v-if="loading"><td colspan="7" class="table-td text-center py-10 text-slate-400">Memuat...</td></tr>
            <tr v-else-if="!periods.length"><td colspan="7" class="table-td text-center py-10 text-slate-400">Belum ada periode.</td></tr>
            <tr v-for="p in periods" :key="p.id" class="hover:bg-slate-50 transition-colors">
              <td class="table-td font-medium text-slate-800">{{ p.name }}</td>
              <td class="table-td">{{ p.academicYear || p.academic_year }}</td>
              <td class="table-td"><BaseBadge :status="(p.isActive ?? p.is_active) ? 'ACTIVE' : 'VOID'" /></td>
              <td class="table-td"><BaseBadge :status="(p.isPublished ?? p.is_published) ? 'ACTIVE' : 'PENDING'" :label="(p.isPublished ?? p.is_published) ? 'Published' : 'Draft'" /></td>
              <td class="table-td text-slate-500 text-xs">{{ formatDateTime(p.announcementDate || p.announcement_date) }}</td>
              <td class="table-td text-slate-500 text-xs">{{ formatDate(p.downloadStartAt || p.download_start_at) }} - {{ formatDate(p.downloadEndAt || p.download_end_at) }}</td>
              <td class="table-td">
                <div class="flex items-center gap-2">
                  <button @click="togglePublish(p)" class="btn-secondary btn-sm" :title="(p.isPublished ?? p.is_published) ? 'Unpublish' : 'Publish'"><Globe class="w-3.5 h-3.5" /></button>
                  <button @click="openEdit(p)" class="btn-secondary btn-sm"><Pencil class="w-3.5 h-3.5" /></button>
                  <button @click="deactivate(p.id)" class="btn-danger btn-sm"><PowerOff class="w-3.5 h-3.5" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <BaseModal :show="showModal" :title="editTarget ? 'Edit Periode' : 'Tambah Periode'" @close="showModal = false" size="lg">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div><label class="label">Nama Periode <span class="text-red-500">*</span></label><input v-model="form.name" class="input" placeholder="cth: Kelulusan Kelas XII 2026" /></div>
          <div><label class="label">Tahun Ajaran <span class="text-red-500">*</span></label><input v-model="form.academic_year" class="input" placeholder="cth: 2025/2026" /></div>
          <div><label class="label">Tanggal Pengumuman</label><input v-model="form.announcement_date" type="datetime-local" class="input" /></div>
          <div><label class="label">Mulai Download</label><input v-model="form.download_start_at" type="datetime-local" class="input" /></div>
          <div><label class="label">Akhir Download</label><input v-model="form.download_end_at" type="datetime-local" class="input" /></div>
          <div class="flex items-center gap-3 mt-6">
            <input type="checkbox" id="published" v-model="form.is_published" class="w-4 h-4 accent-indigo-600" />
            <label for="published" class="text-sm font-medium text-slate-700">Publish (siswa bisa cek)</label>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showModal = false" class="btn-secondary">Batal</button>
          <button @click="save" :disabled="saving" class="btn-primary"><span v-if="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Simpan</button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
<style scoped>
.fade-enter-active,.fade-leave-active{transition:opacity .2s}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>
