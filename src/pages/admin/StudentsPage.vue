<script setup>
import { ref, onMounted } from 'vue'
import { getStudents, createStudent, updateStudent, deleteStudent, importStudents } from '@/services/studentService'
import { getMajors, getClasses, getPeriods } from '@/services/masterService'
import { getErrorMessage } from '@/utils/helpers'
import { formatDate } from '@/utils/formatDate'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { Plus, Search, Upload, Eye, Pencil, PowerOff, RefreshCw } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const data = ref({ data: [], total: 0, page: 1, limit: 20 })
const loading = ref(true)
const error = ref('')
const toast = ref('')
const periods = ref([]); const majors = ref([]); const classes = ref([])
const filters = ref({ graduation_period_id: '', class_id: '', major_id: '', status: '', search: '', page: 1, limit: 20 })

// Create/Edit modal
const showForm = ref(false)
const editTarget = ref(null)
const saving = ref(false)
const emptyForm = () => ({ graduation_period_id: '', class_id: '', major_id: '', nis: '', nisn: '', name: '', gender: '', birth_place: '', birth_date: '', parent_name: '', address: '', phone: '' })
const form = ref(emptyForm())

// Import modal
const showImport = ref(false); const importing = ref(false); const importPeriodId = ref(''); const importFile = ref(null); const importResult = ref(null)

const load = async () => {
  loading.value = true
  try { const r = await getStudents(filters.value); data.value = r.data.data }
  catch (e) { error.value = getErrorMessage(e) } finally { loading.value = false }
}

const openCreate = () => {
  editTarget.value = null
  form.value = emptyForm()
  showForm.value = true
}

const openEdit = (s) => {
  editTarget.value = s
  form.value = {
    graduation_period_id: s.graduationPeriodId ?? s.graduation_period_id ?? '',
    class_id: s.classId ?? s.class_id ?? '',
    major_id: s.majorId ?? s.major_id ?? '',
    nis: s.nis || '',
    nisn: s.nisn || '',
    name: s.name || '',
    gender: s.gender || '',
    birth_place: s.birthPlace ?? s.birth_place ?? '',
    birth_date: s.birthDate ?? s.birth_date ?? '',
    parent_name: s.parentName ?? s.parent_name ?? '',
    address: s.address || '',
    phone: s.phone || '',
  }
  showForm.value = true
}

const save = async () => {
  saving.value = true; error.value = ''
  try {
    if (editTarget.value) {
      await updateStudent(editTarget.value.id, form.value)
      toast.value = 'Data siswa berhasil diperbarui.'
    } else {
      await createStudent(form.value)
      toast.value = 'Siswa berhasil ditambahkan.'
    }
    showForm.value = false
    setTimeout(() => toast.value = '', 3000)
    load()
  } catch (e) { error.value = getErrorMessage(e) } finally { saving.value = false }
}

const deactivate = async (id) => {
  if (!confirm('Nonaktifkan siswa ini?')) return
  try { await deleteStudent(id); load() } catch (e) { error.value = getErrorMessage(e) }
}

const handleImport = async () => {
  if (!importFile.value || !importPeriodId.value) { error.value = 'File dan periode wajib dipilih.'; return }
  importing.value = true; importResult.value = null
  const fd = new FormData()
  fd.append('file', importFile.value)
  fd.append('graduation_period_id', importPeriodId.value)
  try { const r = await importStudents(fd); importResult.value = r.data.data; load() }
  catch (e) { error.value = getErrorMessage(e) } finally { importing.value = false }
}

const changePage = (p) => { filters.value.page = p; load() }

onMounted(async () => {
  const [m, p, c] = await Promise.all([getMajors(), getPeriods(), getClasses({})])
  majors.value = m.data.data; periods.value = p.data.data; classes.value = c.data.data
  load()
})
</script>

<template>
  <div>
    <Transition name="fade">
      <div v-if="toast" class="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">{{ toast }}</div>
    </Transition>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div><h1 class="text-2xl font-bold text-slate-800">Data Siswa</h1><p class="text-slate-500 text-sm">Total: {{ data.total }} siswa</p></div>
      <div class="flex gap-2">
        <button @click="showImport = true" class="btn-secondary"><Upload class="w-4 h-4" />Import Excel</button>
        <button @click="openCreate" class="btn-primary"><Plus class="w-4 h-4" />Tambah Siswa</button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-4">
      <select v-model="filters.graduation_period_id" @change="load" class="input w-48">
        <option value="">Semua Periode</option>
        <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <select v-model="filters.major_id" @change="load" class="input w-44">
        <option value="">Semua Jurusan</option>
        <option v-for="m in majors" :key="m.id" :value="m.id">{{ m.code }}</option>
      </select>
      <select v-model="filters.status" @change="load" class="input w-40">
        <option value="">Semua Status</option>
        <option value="LULUS">Lulus</option>
        <option value="TIDAK_LULUS">Tidak Lulus</option>
        <option value="DITUNDA">Ditunda</option>
      </select>
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input v-model="filters.search" @input="load" class="input pl-9 w-56" placeholder="Cari nama/NIS/NISN..." />
      </div>
      <button @click="load" class="btn-secondary btn-sm"><RefreshCw class="w-4 h-4" /></button>
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{{ error }}</div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="table-th">Nama</th>
              <th class="table-th">NIS/NISN</th>
              <th class="table-th">Kelas</th>
              <th class="table-th">Jurusan</th>
              <th class="table-th">Status</th>
              <th class="table-th">SKL</th>
              <th class="table-th">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <tr v-if="loading"><td colspan="7" class="text-center py-10 text-slate-400">Memuat...</td></tr>
            <tr v-else-if="!data.data.length"><td colspan="7" class="text-center py-10 text-slate-400">Belum ada siswa.</td></tr>
            <tr
              v-for="s in data.data"
              :key="s.id"
              class="hover:bg-slate-50 cursor-pointer transition-colors"
              @click="router.push(`/admin/students/${s.id}`)"
            >
              <td class="table-td font-medium text-slate-800">{{ s.name }}</td>
              <td class="table-td text-slate-500 text-xs">
                <div>{{ s.nis || '-' }}</div>
                <div class="text-slate-400">{{ s.nisn }}</div>
              </td>
              <td class="table-td">{{ s.class?.name || '-' }}</td>
              <td class="table-td"><span class="badge badge-blue">{{ s.major?.code || '-' }}</span></td>
              <td class="table-td"><BaseBadge :status="s.graduationResult?.status || 'DITUNDA'" /></td>
              <td class="table-td">
                <BaseBadge v-if="s.sklDocument" :status="s.sklDocument.status" />
                <span v-else class="badge badge-gray">Belum</span>
              </td>
              <td class="table-td" @click.stop>
                <div class="flex items-center gap-1.5">
                  <button
                    @click="router.push(`/admin/students/${s.id}`)"
                    class="btn-secondary btn-sm"
                    title="Detail"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>
                  <button
                    @click="openEdit(s)"
                    class="btn-secondary btn-sm"
                    title="Edit"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                  </button>
                  <button
                    @click="deactivate(s.id)"
                    class="btn-danger btn-sm"
                    title="Nonaktifkan"
                  >
                    <PowerOff class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="data.total > data.limit" class="flex items-center justify-between px-4 py-3 border-t border-slate-100">
        <p class="text-sm text-slate-500">{{ (data.page - 1) * data.limit + 1 }}-{{ Math.min(data.page * data.limit, data.total) }} dari {{ data.total }}</p>
        <div class="flex gap-1">
          <button @click="changePage(data.page - 1)" :disabled="data.page <= 1" class="btn-secondary btn-sm">←</button>
          <button @click="changePage(data.page + 1)" :disabled="data.page * data.limit >= data.total" class="btn-secondary btn-sm">→</button>
        </div>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <BaseModal
      :show="showForm"
      :title="editTarget ? `Edit Siswa — ${editTarget.name}` : 'Tambah Siswa'"
      @close="showForm = false"
      size="lg"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">Periode <span class="text-red-500">*</span></label>
          <select v-model="form.graduation_period_id" class="input" :disabled="!!editTarget">
            <option value="">Pilih</option>
            <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div>
          <label class="label">Kelas</label>
          <select v-model="form.class_id" class="input">
            <option value="">Pilih</option>
            <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="label">Jurusan</label>
          <select v-model="form.major_id" class="input">
            <option value="">Pilih</option>
            <option v-for="m in majors" :key="m.id" :value="m.id">{{ m.code }} - {{ m.name }}</option>
          </select>
        </div>
        <div>
          <label class="label">Jenis Kelamin</label>
          <select v-model="form.gender" class="input">
            <option value="">Pilih</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
        <div>
          <label class="label">Nama <span class="text-red-500">*</span></label>
          <input v-model="form.name" class="input" placeholder="Nama lengkap" />
        </div>
        <div>
          <label class="label">NISN <span class="text-red-500">*</span></label>
          <input v-model="form.nisn" class="input" placeholder="NISN" />
        </div>
        <div>
          <label class="label">NIS</label>
          <input v-model="form.nis" class="input" placeholder="NIS" />
        </div>
        <div>
          <label class="label">No. HP</label>
          <input v-model="form.phone" class="input" placeholder="No. HP" />
        </div>
        <div>
          <label class="label">Tempat Lahir</label>
          <input v-model="form.birth_place" class="input" placeholder="Kota" />
        </div>
        <div>
          <label class="label">Tanggal Lahir</label>
          <input v-model="form.birth_date" type="date" class="input" />
        </div>
        <div>
          <label class="label">Nama Orang Tua</label>
          <input v-model="form.parent_name" class="input" />
        </div>
        <div></div>
        <div class="col-span-2">
          <label class="label">Alamat</label>
          <textarea v-model="form.address" class="input" rows="2" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showForm = false" class="btn-secondary">Batal</button>
          <button @click="save" :disabled="saving" class="btn-primary">
            <span v-if="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Import Modal -->
    <BaseModal :show="showImport" title="Import Siswa dari Excel" @close="showImport = false">
      <div class="space-y-4">
        <div>
          <label class="label">Periode <span class="text-red-500">*</span></label>
          <select v-model="importPeriodId" class="input">
            <option value="">Pilih Periode</option>
            <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div>
          <label class="label">File Excel <span class="text-red-500">*</span></label>
          <input type="file" accept=".xlsx,.xls" @change="e => importFile = e.target.files[0]" class="block w-full text-sm text-slate-500 mb-2" />
          <div class="flex flex-col gap-1">
            <p class="text-xs text-slate-400">Format kolom: nis, nisn, name, gender, birth_place, birth_date, class_name, major_code, parent_name, address, phone, graduation_status</p>
            <a href="/format_import_siswa.xlsx" download class="text-xs text-indigo-600 font-medium hover:underline self-start">Unduh Template Format Excel</a>
          </div>
        </div>
        <div v-if="importResult" class="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
          <p class="font-semibold text-slate-700">Hasil Import:</p>
          <div class="flex gap-3 flex-wrap">
            <span class="badge badge-blue">Total: {{ importResult.total_rows }}</span>
            <span class="badge badge-green">Berhasil: {{ importResult.success_rows }}</span>
            <span class="badge badge-red">Gagal: {{ importResult.failed_rows }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showImport = false" class="btn-secondary">Tutup</button>
          <button @click="handleImport" :disabled="importing" class="btn-primary">
            <span v-if="importing" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Import
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
