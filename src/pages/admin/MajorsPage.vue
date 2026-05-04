<script setup>
import { ref, onMounted } from 'vue'
import { getMajors, createMajor, updateMajor, deleteMajor } from '@/services/masterService'
import { getErrorMessage } from '@/utils/helpers'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import { Plus, Pencil, PowerOff } from 'lucide-vue-next'

const majors = ref([])
const loading = ref(true)
const showModal = ref(false)
const saving = ref(false)
const editTarget = ref(null)
const error = ref('')
const toast = ref('')
const form = ref({ code: '', name: '', is_active: true })

const load = async () => { loading.value = true; try { const r = await getMajors(); majors.value = r.data.data } catch (e) { error.value = getErrorMessage(e) } finally { loading.value = false } }
const openCreate = () => { editTarget.value = null; form.value = { code: '', name: '', is_active: true }; showModal.value = true }
const openEdit = (m) => { editTarget.value = m; form.value = { code: m.code, name: m.name, is_active: m.isActive ?? m.is_active }; showModal.value = true }
const save = async () => {
  saving.value = true; error.value = ''
  try {
    if (editTarget.value) await updateMajor(editTarget.value.id, form.value)
    else await createMajor(form.value)
    showModal.value = false; toast.value = 'Jurusan disimpan.'; setTimeout(() => toast.value = '', 3000); load()
  } catch (e) { error.value = getErrorMessage(e) } finally { saving.value = false }
}
const deactivate = async (id) => { if (!confirm('Nonaktifkan jurusan ini?')) return; try { await deleteMajor(id); load() } catch (e) { error.value = getErrorMessage(e) } }
onMounted(load)
</script>
<template>
  <div>
    <Transition name="fade"><div v-if="toast" class="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">{{ toast }}</div></Transition>
    <div class="flex items-center justify-between mb-6">
      <div><h1 class="text-2xl font-bold text-slate-800">Jurusan</h1><p class="text-slate-500 text-sm">Kelola data jurusan</p></div>
      <button @click="openCreate" class="btn-primary"><Plus class="w-4 h-4" />Tambah Jurusan</button>
    </div>
    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{{ error }}</div>
    <div class="card overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 border-b border-slate-200"><tr><th class="table-th">Kode</th><th class="table-th">Nama Jurusan</th><th class="table-th">Status</th><th class="table-th">Aksi</th></tr></thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-if="loading"><td colspan="4" class="text-center py-10 text-slate-400">Memuat...</td></tr>
          <tr v-else-if="!majors.length"><td colspan="4" class="text-center py-10 text-slate-400">Belum ada jurusan.</td></tr>
          <tr v-for="m in majors" :key="m.id" class="hover:bg-slate-50">
            <td class="table-td font-mono font-bold text-indigo-600">{{ m.code }}</td>
            <td class="table-td font-medium text-slate-800">{{ m.name }}</td>
            <td class="table-td"><BaseBadge :status="(m.isActive ?? m.is_active) ? 'ACTIVE' : 'VOID'" /></td>
            <td class="table-td"><div class="flex gap-2"><button @click="openEdit(m)" class="btn-secondary btn-sm"><Pencil class="w-3.5 h-3.5" /></button><button @click="deactivate(m.id)" class="btn-danger btn-sm"><PowerOff class="w-3.5 h-3.5" /></button></div></td>
          </tr>
        </tbody>
      </table>
    </div>
    <BaseModal :show="showModal" :title="editTarget ? 'Edit Jurusan' : 'Tambah Jurusan'" @close="showModal = false">
      <div class="space-y-4">
        <div><label class="label">Kode <span class="text-red-500">*</span></label><input v-model="form.code" class="input" placeholder="cth: TKJ" /></div>
        <div><label class="label">Nama Jurusan <span class="text-red-500">*</span></label><input v-model="form.name" class="input" placeholder="cth: Teknik Komputer dan Jaringan" /></div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3"><button @click="showModal = false" class="btn-secondary">Batal</button><button @click="save" :disabled="saving" class="btn-primary">Simpan</button></div>
      </template>
    </BaseModal>
  </div>
</template>
<style scoped>.fade-enter-active,.fade-leave-active{transition:opacity .2s}.fade-enter-from,.fade-leave-to{opacity:0}</style>
