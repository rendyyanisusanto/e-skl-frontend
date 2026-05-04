<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStudent, updateStudent, updateGraduationResult, getRequirements, updateRequirement, uploadSkl, getSkl, updateSkl, deleteSkl } from '@/services/studentService'
import { getErrorMessage, getStatusBadge, getStatusLabel, formatFileSize } from '@/utils/helpers'
import { formatDate } from '@/utils/formatDate'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { ArrowLeft, Upload, FileText, CheckCircle, XCircle, Minus } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const student = ref(null)
const sklDoc = ref(null)
const requirements = ref([])
const loading = ref(true)
const error = ref('')
const toast = ref('')

// Graduate result form
const showResultModal = ref(false)
const resultForm = ref({ status: 'DITUNDA', notes: '' })
const savingResult = ref(false)

// SKL upload
const showSklModal = ref(false)
const sklFile = ref(null)
const sklForm = ref({ document_number: '', notes: '' })
const uploadingSkl = ref(false)

const load = async () => {
  loading.value = true
  try {
    const [sr, rr] = await Promise.all([getStudent(route.params.id), getRequirements(route.params.id)])
    student.value = sr.data.data
    requirements.value = rr.data.data
    try { const sk = await getSkl(route.params.id); sklDoc.value = sk.data.data } catch { sklDoc.value = null }
  } catch (e) { error.value = getErrorMessage(e) } finally { loading.value = false }
}

const openResult = () => { resultForm.value = { status: student.value.graduationResult?.status || 'DITUNDA', notes: student.value.graduationResult?.notes || '' }; showResultModal.value = true }

const saveResult = async () => {
  savingResult.value = true
  try { await updateGraduationResult(student.value.id, resultForm.value); showResultModal.value = false; toast.value = 'Status kelulusan diperbarui.'; setTimeout(() => toast.value = '', 3000); load() }
  catch (e) { error.value = getErrorMessage(e) } finally { savingResult.value = false }
}

const updateReq = async (req, status) => {
  try { await updateRequirement(student.value.id, req.requirementTypeId, { status, notes: req.notes }); load(); toast.value = 'Syarat diperbarui.'; setTimeout(() => toast.value = '', 3000) }
  catch (e) { error.value = getErrorMessage(e) }
}

const handleSklUpload = async () => {
  if (!sklFile.value) { error.value = 'File PDF wajib dipilih.'; return }
  uploadingSkl.value = true
  const fd = new FormData()
  fd.append('file', sklFile.value)
  fd.append('document_number', sklForm.value.document_number)
  fd.append('notes', sklForm.value.notes)
  try { await uploadSkl(student.value.id, fd); showSklModal.value = false; toast.value = 'SKL berhasil diupload.'; setTimeout(() => toast.value = '', 3000); load() }
  catch (e) { error.value = getErrorMessage(e) } finally { uploadingSkl.value = false }
}

const voidSkl = async () => {
  if (!confirm('Void dokumen SKL ini?')) return
  try { await deleteSkl(student.value.id); load(); toast.value = 'Dokumen SKL divoid.'; setTimeout(() => toast.value = '', 3000) }
  catch (e) { error.value = getErrorMessage(e) }
}

onMounted(load)
</script>

<template>
  <div>
    <Transition name="fade"><div v-if="toast" class="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm">{{ toast }}</div></Transition>

    <button @click="router.back()" class="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-4 transition-colors">
      <ArrowLeft class="w-4 h-4" /> Kembali
    </button>

    <div v-if="loading" class="text-center py-20 text-slate-400">Memuat data siswa...</div>
    <div v-else-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{{ error }}</div>

    <div v-else-if="student" class="space-y-6">
      <!-- Biodata -->
      <div class="card p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-xl font-bold text-slate-800">{{ student.name }}</h1>
            <p class="text-slate-500 text-sm">NISN: {{ student.nisn }} | NIS: {{ student.nis || '-' }}</p>
          </div>
          <BaseBadge :status="student.graduationResult?.status || 'DITUNDA'" />
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div><p class="text-slate-400 text-xs">Kelas</p><p class="font-medium">{{ student.class?.name || '-' }}</p></div>
          <div><p class="text-slate-400 text-xs">Jurusan</p><p class="font-medium">{{ student.major?.name || '-' }}</p></div>
          <div><p class="text-slate-400 text-xs">Jenis Kelamin</p><p class="font-medium">{{ student.gender === 'L' ? 'Laki-laki' : student.gender === 'P' ? 'Perempuan' : '-' }}</p></div>
          <div><p class="text-slate-400 text-xs">Tanggal Lahir</p><p class="font-medium">{{ formatDate(student.birthDate || student.birth_date) }}</p></div>
          <div><p class="text-slate-400 text-xs">Orang Tua</p><p class="font-medium">{{ student.parentName || student.parent_name || '-' }}</p></div>
          <div><p class="text-slate-400 text-xs">No. HP</p><p class="font-medium">{{ student.phone || '-' }}</p></div>
        </div>
        <div class="mt-4">
          <button @click="openResult" class="btn-primary btn-sm">Ubah Status Kelulusan</button>
        </div>
      </div>

      <!-- Requirements -->
      <div class="card p-6">
        <h2 class="font-semibold text-slate-800 mb-4">Syarat SKL</h2>
        <div v-if="!requirements.length" class="text-slate-400 text-sm">Belum ada syarat.</div>
        <div class="space-y-2">
          <div v-for="req in requirements" :key="req.id" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p class="font-medium text-slate-800 text-sm">{{ req.requirementType?.name }}</p>
              <p v-if="req.notes" class="text-slate-400 text-xs">{{ req.notes }}</p>
            </div>
            <div class="flex items-center gap-2">
              <BaseBadge :status="req.status" />
              <button @click="updateReq(req, 'COMPLETED')" :disabled="req.status === 'COMPLETED'" class="btn-success btn-sm" title="Selesai"><CheckCircle class="w-3.5 h-3.5" /></button>
              <button @click="updateReq(req, 'REJECTED')" :disabled="req.status === 'REJECTED'" class="btn-danger btn-sm" title="Tolak"><XCircle class="w-3.5 h-3.5" /></button>
              <button @click="updateReq(req, 'WAIVED')" :disabled="req.status === 'WAIVED'" class="btn-secondary btn-sm" title="Bebaskan"><Minus class="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      </div>

      <!-- SKL Document -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-slate-800">Dokumen SKL</h2>
          <button @click="showSklModal = true" class="btn-primary btn-sm"><Upload class="w-3.5 h-3.5" />{{ sklDoc ? 'Ganti SKL' : 'Upload SKL' }}</button>
        </div>
        <div v-if="!sklDoc" class="text-slate-400 text-sm py-4 text-center">Belum ada dokumen SKL.</div>
        <div v-else class="bg-slate-50 rounded-xl p-4 space-y-3">
          <div class="flex items-center gap-3">
            <FileText class="w-8 h-8 text-red-500" />
            <div class="flex-1">
              <p class="font-medium text-slate-800 text-sm">{{ sklDoc.originalFileName || sklDoc.original_file_name }}</p>
              <p class="text-slate-400 text-xs">{{ formatFileSize(sklDoc.fileSize || sklDoc.file_size) }} • {{ formatDate(sklDoc.uploadedAt || sklDoc.uploaded_at) }}</p>
            </div>
            <BaseBadge :status="sklDoc.status" />
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div><p class="text-xs text-slate-400">Kode Verifikasi</p><p class="font-mono text-xs text-indigo-600 font-bold">{{ sklDoc.verificationCode || sklDoc.verification_code }}</p></div>
            <div><p class="text-xs text-slate-400">No. Dokumen</p><p class="text-sm">{{ sklDoc.documentNumber || sklDoc.document_number || '-' }}</p></div>
          </div>
          <div class="flex gap-2 mt-2">
            <button @click="voidSkl" class="btn-danger btn-sm">Void Dokumen</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Modal -->
    <BaseModal :show="showResultModal" title="Ubah Status Kelulusan" @close="showResultModal = false">
      <div class="space-y-4">
        <div><label class="label">Status *</label><select v-model="resultForm.status" class="input"><option value="LULUS">LULUS</option><option value="TIDAK_LULUS">TIDAK LULUS</option><option value="DITUNDA">DITUNDA</option></select></div>
        <div><label class="label">Catatan</label><textarea v-model="resultForm.notes" class="input" rows="3" /></div>
      </div>
      <template #footer><div class="flex justify-end gap-3"><button @click="showResultModal = false" class="btn-secondary">Batal</button><button @click="saveResult" :disabled="savingResult" class="btn-primary">Simpan</button></div></template>
    </BaseModal>

    <!-- SKL Upload Modal -->
    <BaseModal :show="showSklModal" title="Upload PDF SKL" @close="showSklModal = false">
      <div class="space-y-4">
        <div><label class="label">File PDF SKL *</label><input type="file" accept="application/pdf" @change="e => sklFile = e.target.files[0]" class="block w-full text-sm text-slate-500" /><p class="text-xs text-slate-400 mt-1">Maksimal 5MB, format PDF.</p></div>
        <div><label class="label">No. Dokumen</label><input v-model="sklForm.document_number" class="input" placeholder="Nomor SKL (opsional)" /></div>
        <div><label class="label">Catatan</label><textarea v-model="sklForm.notes" class="input" rows="2" /></div>
      </div>
      <template #footer><div class="flex justify-end gap-3"><button @click="showSklModal = false" class="btn-secondary">Batal</button><button @click="handleSklUpload" :disabled="uploadingSkl" class="btn-primary"><span v-if="uploadingSkl" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Upload</button></div></template>
    </BaseModal>
  </div>
</template>
<style scoped>.fade-enter-active,.fade-leave-active{transition:opacity .2s}.fade-enter-from,.fade-leave-to{opacity:0}</style>
