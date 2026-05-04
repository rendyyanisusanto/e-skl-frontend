<script setup>
import { ref, onMounted } from 'vue'
import { getRequirementTypes, createRequirementType, updateRequirementType, deleteRequirementType, getPeriods } from '@/services/masterService'
import { getErrorMessage } from '@/utils/helpers'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import { Plus, Pencil, PowerOff } from 'lucide-vue-next'

const types = ref([]); const periods = ref([]); const loading = ref(true); const showModal = ref(false); const saving = ref(false); const editTarget = ref(null); const error = ref(''); const toast = ref('')
const selectedPeriod = ref('')
const form = ref({ graduation_period_id: '', name: '', description: '', is_required: true, sort_order: 0 })

const load = async () => { loading.value = true; try { const r = await getRequirementTypes({ graduation_period_id: selectedPeriod.value }); types.value = r.data.data } catch (e) { error.value = getErrorMessage(e) } finally { loading.value = false } }
const openCreate = () => { editTarget.value = null; form.value = { graduation_period_id: selectedPeriod.value || '', name: '', description: '', is_required: true, sort_order: 0 }; showModal.value = true }
const openEdit = (t) => { editTarget.value = t; form.value = { graduation_period_id: t.graduationPeriodId || t.graduation_period_id, name: t.name, description: t.description || '', is_required: t.isRequired ?? t.is_required, sort_order: t.sortOrder ?? t.sort_order }; showModal.value = true }
const save = async () => { saving.value = true; error.value = ''; try { if (editTarget.value) await updateRequirementType(editTarget.value.id, form.value); else await createRequirementType(form.value); showModal.value = false; toast.value = 'Syarat disimpan.'; setTimeout(() => toast.value = '', 3000); load() } catch (e) { error.value = getErrorMessage(e) } finally { saving.value = false } }
const deactivate = async (id) => { if (!confirm('Nonaktifkan syarat ini?')) return; try { await deleteRequirementType(id); load() } catch (e) { error.value = getErrorMessage(e) } }
onMounted(async () => { const r = await getPeriods(); periods.value = r.data.data; load() })
</script>
<template>
  <div>
    <Transition name="fade"><div v-if="toast" class="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm">{{ toast }}</div></Transition>
    <div class="flex items-center justify-between mb-6">
      <div><h1 class="text-2xl font-bold text-slate-800">Syarat SKL</h1><p class="text-slate-500 text-sm">Kelola syarat pengambilan SKL</p></div>
      <button @click="openCreate" class="btn-primary"><Plus class="w-4 h-4" />Tambah Syarat</button>
    </div>
    <div class="flex gap-3 mb-4">
      <select v-model="selectedPeriod" @change="load" class="input w-56"><option value="">Semua Periode</option><option v-for="p in periods" :key="p.id" :value="p.id">{{ p.name }}</option></select>
    </div>
    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{{ error }}</div>
    <div class="card overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 border-b border-slate-200"><tr><th class="table-th">Urutan</th><th class="table-th">Nama Syarat</th><th class="table-th">Deskripsi</th><th class="table-th">Wajib</th><th class="table-th">Status</th><th class="table-th">Aksi</th></tr></thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-if="loading"><td colspan="6" class="text-center py-10 text-slate-400">Memuat...</td></tr>
          <tr v-else-if="!types.length"><td colspan="6" class="text-center py-10 text-slate-400">Belum ada syarat.</td></tr>
          <tr v-for="t in types" :key="t.id" class="hover:bg-slate-50">
            <td class="table-td text-center text-slate-400">{{ t.sortOrder ?? t.sort_order }}</td>
            <td class="table-td font-medium text-slate-800">{{ t.name }}</td>
            <td class="table-td text-slate-500">{{ t.description || '-' }}</td>
            <td class="table-td"><span :class="(t.isRequired ?? t.is_required) ? 'badge badge-red' : 'badge badge-gray'">{{ (t.isRequired ?? t.is_required) ? 'Wajib' : 'Opsional' }}</span></td>
            <td class="table-td"><BaseBadge :status="(t.isActive ?? t.is_active) ? 'ACTIVE' : 'VOID'" /></td>
            <td class="table-td"><div class="flex gap-2"><button @click="openEdit(t)" class="btn-secondary btn-sm"><Pencil class="w-3.5 h-3.5" /></button><button @click="deactivate(t.id)" class="btn-danger btn-sm"><PowerOff class="w-3.5 h-3.5" /></button></div></td>
          </tr>
        </tbody>
      </table>
    </div>
    <BaseModal :show="showModal" :title="editTarget ? 'Edit Syarat' : 'Tambah Syarat'" @close="showModal = false">
      <div class="space-y-4">
        <div><label class="label">Periode *</label><select v-model="form.graduation_period_id" class="input"><option value="">Pilih</option><option v-for="p in periods" :key="p.id" :value="p.id">{{ p.name }}</option></select></div>
        <div><label class="label">Nama Syarat *</label><input v-model="form.name" class="input" placeholder="cth: Ujian Sekolah" /></div>
        <div><label class="label">Deskripsi</label><textarea v-model="form.description" class="input" rows="2" /></div>
        <div class="flex gap-4"><div><label class="label">Urutan</label><input v-model.number="form.sort_order" type="number" class="input w-24" /></div><div class="flex items-center gap-2 mt-6"><input type="checkbox" id="required" v-model="form.is_required" class="w-4 h-4 accent-indigo-600" /><label for="required" class="text-sm font-medium text-slate-700">Syarat Wajib</label></div></div>
      </div>
      <template #footer><div class="flex justify-end gap-3"><button @click="showModal = false" class="btn-secondary">Batal</button><button @click="save" :disabled="saving" class="btn-primary">Simpan</button></div></template>
    </BaseModal>
  </div>
</template>
<style scoped>.fade-enter-active,.fade-leave-active{transition:opacity .2s}.fade-enter-from,.fade-leave-to{opacity:0}</style>
