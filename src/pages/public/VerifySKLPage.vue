<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { verifySkl } from '@/services/sklService'
import { CheckCircle, XCircle, ShieldCheck, FileText, User, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const loading = ref(true)
const result = ref(null)
const error = ref('')

onMounted(async () => {
  try {
    const r = await verifySkl(route.params.verificationCode)
    result.value = r.data.data
  } catch (e) {
    error.value = 'Kode verifikasi tidak ditemukan atau dokumen tidak sah.'
  } finally { loading.value = false }
})
</script>

<template>
  <div class="w-full flex flex-col items-center py-16 px-4">
    <!-- Header Area -->
    <div class="w-full max-w-3xl text-center mb-12">
      <div class="inline-flex items-center justify-center w-24 h-24 bg-indigo-50 rounded-3xl mb-6 shadow-inner border border-indigo-100 transform rotate-3">
        <ShieldCheck class="w-12 h-12 text-indigo-600 -rotate-3" />
      </div>
      <h1 class="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">Verifikasi Keaslian Dokumen</h1>
      <p class="text-slate-500 text-lg md:text-xl font-light">Sistem Pengecekan Dokumen SKL Resmi Terintegrasi</p>
      
      <div class="mt-6 inline-flex items-center gap-3 bg-white px-5 py-2 rounded-full border border-slate-200 shadow-sm">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">KODE DOKUMEN</span>
        <span class="font-mono text-indigo-700 font-bold tracking-wider">{{ route.params.verificationCode }}</span>
      </div>
    </div>

    <!-- Main Card -->
    <div class="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
      
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <!-- Loading State -->
      <div v-if="loading" class="p-20 text-center relative z-10">
        <div class="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6" />
        <h3 class="text-xl font-bold text-slate-800 mb-2">Memeriksa Basis Data...</h3>
        <p class="text-slate-500 font-medium">Sedang memvalidasi keaslian dokumen dengan server.</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-16 text-center relative z-10 bg-red-50/50">
        <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <XCircle class="w-12 h-12 text-red-600" />
        </div>
        <h3 class="text-2xl font-black text-red-900 mb-3">Dokumen Tidak Valid</h3>
        <p class="text-red-700 font-medium max-w-md mx-auto">{{ error }}</p>
      </div>

      <!-- Result State -->
      <div v-else-if="result" class="relative z-10">
        <!-- Status Header Banner -->
        <div :class="['px-10 py-10 text-center border-b', result.valid ? 'bg-gradient-to-b from-emerald-50 to-white border-emerald-100' : 'bg-gradient-to-b from-red-50 to-white border-red-100']">
          <div :class="['inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 shadow-xl', 
            result.valid ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-red-500 shadow-red-500/30']">
            <CheckCircle v-if="result.valid" class="w-12 h-12 text-white" />
            <XCircle v-else class="w-12 h-12 text-white" />
          </div>
          <h2 :class="['text-3xl font-black tracking-tight mb-2', result.valid ? 'text-emerald-800' : 'text-red-800']">
            {{ result.valid ? 'Dokumen Valid & Sah' : 'Dokumen Tidak Valid' }}
          </h2>
          <p v-if="result.valid" class="text-emerald-600 font-medium text-lg">Dokumen ini diterbitkan secara resmi oleh sistem sekolah.</p>
          <p v-else class="text-red-600 font-medium text-lg">Hati-hati! Dokumen ini terindikasi palsu atau telah dibatalkan.</p>
        </div>

        <div class="p-10 space-y-8">
          <!-- Identitas Siswa -->
          <div v-if="result.student" class="bg-slate-50/80 rounded-3xl p-8 border border-slate-100">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <User class="w-6 h-6" />
              </div>
              <h3 class="text-xl font-bold text-slate-800">Identitas Siswa</h3>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Lengkap</p>
                <p class="text-lg font-bold text-slate-800">{{ result.student.name }}</p>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">NISN</p>
                <p class="text-lg font-mono font-bold text-indigo-600">{{ result.student.nisn }}</p>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Kelas</p>
                <p class="text-lg font-semibold text-slate-800">{{ result.student.class || '-' }}</p>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Jurusan</p>
                <p class="text-lg font-semibold text-slate-800">{{ result.student.major || '-' }}</p>
              </div>
              <div class="sm:col-span-2 pt-4 border-t border-slate-200/60 mt-2">
                <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Status Kelulusan</p>
                <span :class="['inline-flex px-4 py-1.5 rounded-xl text-sm font-black tracking-widest uppercase', 
                  result.student.graduation_status === 'LULUS' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200']">
                  {{ result.student.graduation_status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Informasi Dokumen -->
          <div v-if="result.document" class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-blue-100 rounded-lg text-blue-600">
                <FileText class="w-6 h-6" />
              </div>
              <h3 class="text-xl font-bold text-slate-800">Detail Dokumen</h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">No. Dokumen</p>
                <p class="font-semibold text-slate-800">{{ result.document.document_number || 'Tidak/Belum Ada' }}</p>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Status Sistem</p>
                <span :class="['inline-flex px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider', 
                  result.document.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100']">
                  {{ result.document.status === 'ACTIVE' ? 'AKTIF' : 'TIDAK AKTIF' }}
                </span>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Periode Kelulusan</p>
                <p class="font-semibold text-slate-800">{{ result.document.period || '-' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Back Action -->
    <div class="mt-12">
      <router-link to="/" class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all shadow-sm group">
        <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Beranda
      </router-link>
    </div>
  </div>
</template>
