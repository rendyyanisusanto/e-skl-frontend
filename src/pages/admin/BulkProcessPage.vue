<script setup>
import { ref, onMounted, watch } from 'vue'
import { getPeriods } from '@/services/masterService'
import { getClasses } from '@/services/masterService'
import { getRequirementTypes } from '@/services/masterService'
import { getStudents, bulkUpdateRequirements, uploadSkl } from '@/services/studentService'
import { getErrorMessage, getStatusBadge, getStatusLabel } from '@/utils/helpers'
import { Filter, Save, Upload, CheckCircle, AlertCircle, FileText } from 'lucide-vue-next'

const periods = ref([])
const classes = ref([])
const requirementTypes = ref([])
const students = ref([])

const filters = ref({
  graduation_period_id: '',
  class_id: ''
})

const loading = ref(false)
const saving = ref(false)
const error = ref('')
const toast = ref('')

const requirementCheckboxes = ref({})

onMounted(async () => {
  try {
    const [pRes, cRes] = await Promise.all([getPeriods(), getClasses({ limit: 'all' })])
    periods.value = pRes.data.data
    classes.value = cRes.data.data.data || cRes.data.data
    if (periods.value.length > 0) {
      filters.value.graduation_period_id = periods.value[periods.value.length - 1].id
    }
  } catch (e) {
    error.value = getErrorMessage(e)
  }
})

watch(() => filters.value.graduation_period_id, async (newId) => {
  if (newId) {
    try {
      const res = await getRequirementTypes({ graduation_period_id: newId, limit: 'all' })
      requirementTypes.value = res.data.data.data || res.data.data
    } catch (e) {
      error.value = getErrorMessage(e)
    }
    loadStudents()
  } else {
    requirementTypes.value = []
  }
})

watch(() => filters.value.class_id, () => {
  loadStudents()
})

const loadStudents = async () => {
  if (!filters.value.graduation_period_id || !filters.value.class_id) {
    students.value = []
    return
  }
  
  loading.value = true
  error.value = ''
  try {
    const res = await getStudents({ 
      ...filters.value, 
      limit: 'all',
      include_requirements: true
    })
    
    // Process student requirements into checkboxes map
    students.value = res.data.data
    const cbMap = {}
    students.value.forEach(s => {
      cbMap[s.id] = {}
      if (s.requirements) {
        s.requirements.forEach(req => {
          cbMap[s.id][req.requirementTypeId] = req.status === 'COMPLETED'
        })
      }
    })
    requirementCheckboxes.value = cbMap
  } catch (e) {
    error.value = getErrorMessage(e)
  } finally {
    loading.value = false
  }
}

const showToast = (msg) => {
  toast.value = msg
  setTimeout(() => toast.value = '', 3000)
}

const saveAllRequirements = async () => {
  if (!students.value.length) return
  saving.value = true
  error.value = ''
  
  try {
    const updates = []
    students.value.forEach(s => {
      requirementTypes.value.forEach(rt => {
        const isChecked = requirementCheckboxes.value[s.id] && requirementCheckboxes.value[s.id][rt.id]
        updates.push({
          studentId: s.id,
          requirementTypeId: rt.id,
          status: isChecked ? 'COMPLETED' : 'PENDING'
        })
      })
    })
    
    await bulkUpdateRequirements({ updates })
    showToast('Seluruh syarat berhasil disimpan!')
    await loadStudents() // refresh
  } catch (e) {
    error.value = getErrorMessage(e)
  } finally {
    saving.value = false
  }
}

const handleFileUpload = async (studentId, event) => {
  const file = event.target.files[0]
  if (!file) return
  if (file.type !== 'application/pdf') {
    alert('Hanya file PDF yang diperbolehkan.')
    event.target.value = ''
    return
  }
  
  try {
    const formData = new FormData()
    formData.append('file', file)
    await uploadSkl(studentId, formData)
    showToast('SKL berhasil diunggah untuk siswa tersebut.')
    
    // Find student and update local UI directly without full reload
    const student = students.value.find(s => s.id === studentId)
    if (student) {
      if (!student.sklDocument) student.sklDocument = {}
      student.sklDocument.status = 'AVAILABLE'
      student.sklDocument.originalFileName = file.name
    }
  } catch (e) {
    alert(getErrorMessage(e))
  } finally {
    event.target.value = ''
  }
}
</script>

<template>
  <div class="space-y-6">
    <Transition name="fade"><div v-if="toast" class="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2"><CheckCircle class="w-4 h-4"/> {{ toast }}</div></Transition>
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Proses Massal Syarat & SKL</h1>
        <p class="text-slate-500 text-sm mt-1">Kelola centangan syarat dan upload dokumen per kelas secara cepat.</p>
      </div>
      
      <button v-if="students.length > 0" @click="saveAllRequirements" :disabled="saving" class="btn-primary flex items-center gap-2 px-6 py-2.5">
        <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        <Save v-else class="w-4 h-4" />
        {{ saving ? 'Menyimpan...' : 'Simpan Semua Syarat' }}
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
      <div class="w-full sm:w-64">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Periode Lulus</label>
        <div class="relative">
          <Filter class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select v-model="filters.graduation_period_id" class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500">
            <option value="">-- Pilih Periode --</option>
            <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.name }} ({{ p.year }})</option>
          </select>
        </div>
      </div>
      <div class="w-full sm:w-64">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Kelas</label>
        <div class="relative">
          <Filter class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select v-model="filters.class_id" class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500">
            <option value="">-- Pilih Kelas --</option>
            <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{{ error }}</div>

    <div v-if="loading" class="text-center py-20 text-slate-400">
      <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
      Memuat data kelas...
    </div>

    <!-- Main Table -->
    <div v-else-if="students.length > 0" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="py-3 px-4 font-semibold text-slate-600 w-12 text-center">No</th>
              <th class="py-3 px-4 font-semibold text-slate-600 min-w-[200px]">Nama Siswa</th>
              
              <!-- Dynamic Requirements Columns -->
              <th v-for="rt in requirementTypes" :key="rt.id" class="py-3 px-4 font-semibold text-slate-600 text-center min-w-[100px]">
                {{ rt.name }}
              </th>
              
              <th class="py-3 px-4 font-semibold text-slate-600 min-w-[250px]">Upload SKL (PDF)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(student, idx) in students" :key="student.id" class="hover:bg-slate-50 transition-colors group">
              <td class="py-3 px-4 text-center text-slate-500">{{ idx + 1 }}</td>
              <td class="py-3 px-4">
                <div class="font-medium text-slate-800">{{ student.name }}</div>
                <div class="text-xs text-slate-400">{{ student.nisn }}</div>
              </td>
              
              <!-- Dynamic Checkboxes -->
              <td v-for="rt in requirementTypes" :key="rt.id" class="py-3 px-4 text-center">
                <label class="inline-flex items-center cursor-pointer">
                  <input type="checkbox" 
                         v-model="requirementCheckboxes[student.id][rt.id]"
                         class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                </label>
              </td>
              
              <!-- Upload Cell -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div v-if="student.sklDocument?.status === 'AVAILABLE'" class="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold border border-emerald-100 shrink-0">
                    <CheckCircle class="w-3.5 h-3.5" /> Ada
                  </div>
                  <div v-else class="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2 py-1 rounded text-xs font-bold border border-slate-200 shrink-0">
                    <AlertCircle class="w-3.5 h-3.5" /> Kosong
                  </div>
                  
                  <div class="relative overflow-hidden w-full max-w-[200px]">
                    <button class="w-full btn-secondary btn-sm flex justify-center items-center gap-1.5 relative z-10 group-hover:bg-slate-100">
                      <Upload class="w-3.5 h-3.5" />
                      <span class="truncate">{{ student.sklDocument?.originalFileName || 'Pilih File' }}</span>
                    </button>
                    <!-- Invisible file input overlaid on button -->
                    <input type="file" accept="application/pdf" @change="handleFileUpload(student.id, $event)" class="absolute inset-0 opacity-0 cursor-pointer z-20" title="Pilih File PDF SKL" />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div v-else-if="filters.class_id && !loading" class="text-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
      Tidak ada data siswa pada kelas ini.
    </div>
  </div>
</template>
