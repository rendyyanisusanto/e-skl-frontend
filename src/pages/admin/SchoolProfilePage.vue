<script setup>
import { ref, onMounted } from 'vue'
import { getSchoolProfile, updateSchoolProfile } from '@/services/masterService'
import { getErrorMessage } from '@/utils/helpers'
import { Save } from 'lucide-vue-next'

const profile = ref(null)
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const toast = ref('')
const form = ref({ school_name: '', npsn: '', address: '', phone: '', email: '', website: '' })

const load = async () => { loading.value = true; try { const r = await getSchoolProfile(); profile.value = r.data.data; form.value = { school_name: r.data.data.schoolName || r.data.data.school_name, npsn: r.data.data.npsn || '', address: r.data.data.address || '', phone: r.data.data.phone || '', email: r.data.data.email || '', website: r.data.data.website || '' } } catch (e) { error.value = getErrorMessage(e) } finally { loading.value = false } }

const save = async () => { saving.value = true; error.value = ''; try { await updateSchoolProfile(form.value); toast.value = 'Profil sekolah disimpan.'; setTimeout(() => toast.value = '', 3000); load() } catch (e) { error.value = getErrorMessage(e) } finally { saving.value = false } }
onMounted(load)
</script>
<template>
  <div class="max-w-2xl">
    <Transition name="fade"><div v-if="toast" class="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm">{{ toast }}</div></Transition>
    <div class="mb-6"><h1 class="text-2xl font-bold text-slate-800">Profil Sekolah</h1><p class="text-slate-500 text-sm">Informasi sekolah untuk tampilan publik</p></div>
    <div v-if="loading" class="text-center py-10 text-slate-400">Memuat...</div>
    <div v-else class="card p-6 space-y-4">
      <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{{ error }}</div>
      <div><label class="label">Nama Sekolah *</label><input v-model="form.school_name" class="input" /></div>
      <div><label class="label">NPSN</label><input v-model="form.npsn" class="input" /></div>
      <div><label class="label">Alamat</label><textarea v-model="form.address" class="input" rows="3" /></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="label">No. Telepon</label><input v-model="form.phone" class="input" /></div>
        <div><label class="label">Email</label><input v-model="form.email" type="email" class="input" /></div>
        <div class="col-span-2"><label class="label">Website</label><input v-model="form.website" class="input" placeholder="https://" /></div>
      </div>
      <div class="flex justify-end pt-2"><button @click="save" :disabled="saving" class="btn-primary"><Save class="w-4 h-4" />{{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}</button></div>
    </div>
  </div>
</template>
<style scoped>.fade-enter-active,.fade-leave-active{transition:opacity .2s}.fade-enter-from,.fade-leave-to{opacity:0}</style>
