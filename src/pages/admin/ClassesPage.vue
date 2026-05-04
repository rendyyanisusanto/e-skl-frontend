<script setup>
import { ref, onMounted } from 'vue'
import { getMajors, getClasses, createClass, updateClass, deleteClass, getPeriods } from '@/services/masterService'
import { getErrorMessage } from '@/utils/helpers'
import BaseModal from '@/components/common/BaseModal.vue'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'

const classes = ref([])
const majors = ref([])
const periods = ref([])
const loading = ref(true)
const showModal = ref(false)
const saving = ref(false)
const editTarget = ref(null)
const error = ref('')
const toast = ref('')
const filters = ref({ graduation_period_id: '', major_id: '', search: '' })
const form = ref({ graduation_period_id: '', major_id: '', name: '', homeroom_teacher: '' })

const load = async () => {
  loading.value = true
  try { const r = await getClasses(filters.value); classes.value = r.data.data }
  catch (e) { error.value = getErrorMessage(e) } finally { loading.value = false }
}
const openCreate = () => { editTarget.value = null; form.value = { graduation_period_id: '', major_id: '', name: '', homeroom_teacher: '' }; showModal.value = true }
const openEdit = (c) => { editTarget.value = c; form.value = { graduation_period_id: c.graduationPeriodId || c.graduation_period_id, major_id: c.majorId || c.major_id || '', name: c.name, homeroom_teacher: c.homeroomTeacher || c.homeroom_teacher || '' }; showModal.value = true }
const save = async () => {
  saving.value = true; error.value = ''
  try {
    if (editTarget.value) await updateClass(editTarget.value.id, form.value)
    else await createClass(form.value)
    showModal.value = false; toast.value = 'Kelas disimpan.'; setTimeout(() => toast.value = '', 3000); load()
  } catch (e) { error.value = getErrorMessage(e) } finally { saving.value = false }
}
const remove = async (id) => { if (!confirm('Hapus kelas ini?')) return; try { await deleteClass(id); load() } catch (e) { error.value = getErrorMessage(e) } }

onMounted(async () => {
  const [m, p] = await Promise.all([getMajors(), getPeriods()])
  majors.value = m.data.data
  periods.value = p.data.data
  load()
})
</script>
<template>
  <div>
    <Transition name="fade"><div v-if="toast" class="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm">{{ toast }}</div></Transition>
    <div class="flex items-center justify-between mb-6">
      <div><h1 class="text-2xl font-bold text-slate-800">Kelas</h1><p class="text-slate-500 text-sm">Kelola data kelas</p></div>
      <button @click="openCreate" class="btn-primary"><Plus class="w-4 h-4" />Tambah Kelas</button>
    </div>
    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-4">
      <select v-model="filters.graduation_period_id" @change="load" class="input w-48"><option value="">Semua Periode</option><option v-for="p in periods" :key="p.id" :value="p.id">{{ p.name }}</option></select>
      <select v-model="filters.major_id" @change="load" class="input w-48"><option value="">Semua Jurusan</option><option v-for="m in majors" :key="m.id" :value="m.id">{{ m.code }} - {{ m.name }}</option></select>
      <input v-model="filters.search" @input="load" class="input w-56" placeholder="Cari kelas..." />
    </div>
    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{{ error }}</div>
    <div class="card overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 border-b border-slate-200"><tr><th class="table-th">Nama Kelas</th><th class="table-th">Jurusan</th><th class="table-th">Wali Kelas</th><th class="table-th">Periode</th><th class="table-th">Aksi</th></tr></thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-if="loading"><td colspan="5" class="text-center py-10 text-slate-400">Memuat...</td></tr>
          <tr v-else-if="!classes.length"><td colspan="5" class="text-center py-10 text-slate-400">Belum ada kelas.</td></tr>
          <tr v-for="c in classes" :key="c.id" class="hover:bg-slate-50">
            <td class="table-td font-semibold text-slate-800">{{ c.name }}</td>
            <td class="table-td"><span class="badge badge-blue">{{ c.major?.code || '-' }}</span></td>
            <td class="table-td text-slate-500">{{ c.homeroomTeacher || c.homeroom_teacher || '-' }}</td>
            <td class="table-td text-slate-500 text-xs">{{ c.graduationPeriod?.name || '-' }}</td>
            <td class="table-td"><div class="flex gap-2"><button @click="openEdit(c)" class="btn-secondary btn-sm"><Pencil class="w-3.5 h-3.5" /></button><button @click="remove(c.id)" class="btn-danger btn-sm"><Trash2 class="w-3.5 h-3.5" /></button></div></td>
          </tr>
        </tbody>
      </table>
    </div>
    <BaseModal :show="showModal" :title="editTarget ? 'Edit Kelas' : 'Tambah Kelas'" @close="showModal = false">
      <div class="space-y-4">
        <div><label class="label">Periode <span class="text-red-500">*</span></label><select v-model="form.graduation_period_id" class="input"><option value="">Pilih Periode</option><option v-for="p in periods" :key="p.id" :value="p.id">{{ p.name }}</option></select></div>
        <div><label class="label">Jurusan</label><select v-model="form.major_id" class="input"><option value="">Pilih Jurusan</option><option v-for="m in majors" :key="m.id" :value="m.id">{{ m.code }} - {{ m.name }}</option></select></div>
        <div><label class="label">Nama Kelas <span class="text-red-500">*</span></label><input v-model="form.name" class="input" placeholder="cth: XII TKJ 1" /></div>
        <div><label class="label">Wali Kelas</label><input v-model="form.homeroom_teacher" class="input" placeholder="Nama wali kelas" /></div>
      </div>
      <template #footer><div class="flex justify-end gap-3"><button @click="showModal = false" class="btn-secondary">Batal</button><button @click="save" :disabled="saving" class="btn-primary">Simpan</button></div></template>
    </BaseModal>
  </div>
</template>
<style scoped>.fade-enter-active,.fade-leave-active{transition:opacity .2s}.fade-enter-from,.fade-leave-to{opacity:0}</style>
