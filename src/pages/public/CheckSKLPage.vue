<script setup>
import { ref, onMounted } from 'vue'
import { checkSkl, getDownloadUrl, getPublicSchoolProfile } from '@/services/sklService'
import { getErrorMessage } from '@/utils/helpers'
import { Search, CheckCircle, XCircle, AlertCircle, Download, ShieldCheck, FileText, ArrowRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({ nisn: '', birth_date: '' })
const loading = ref(false)
const result = ref(null)
const error = ref('')
const schoolName = ref('E-SKL Digital')

onMounted(async () => {
  try {
    const res = await getPublicSchoolProfile()
    if (res.data.data && res.data.data.schoolName) {
      schoolName.value = res.data.data.schoolName
    }
  } catch (e) {
    // Ignore error if profile not found
  }
})

const search = async () => {
  if (!form.value.nisn || !form.value.birth_date) { error.value = 'NISN dan tanggal lahir wajib diisi.'; return }
  loading.value = true; result.value = null; error.value = ''
  try {
    const r = await checkSkl({ nisn: form.value.nisn, birth_date: form.value.birth_date })
    result.value = r.data.data
  } catch (e) {
    if (e.response?.status === 404) error.value = 'Data siswa tidak ditemukan. Periksa kembali NISN dan tanggal lahir.'
    else error.value = getErrorMessage(e)
  } finally { loading.value = false }
}

const downloadUrl = (code) => getDownloadUrl(code)

// Background image from Unsplash (Education/School theme)
const bgUrl = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop'
</script>

<template>
  <div class="flex-grow flex flex-col w-full">
    <!-- Hero Section -->
    <div class="relative bg-indigo-900 overflow-hidden">
      <!-- Background Decorations -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity" :style="{ backgroundImage: `url(${bgUrl})` }"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/80 to-indigo-950"></div>
        <div class="absolute -top-48 -right-48 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
        <div class="absolute -bottom-48 -left-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col items-center text-center">
        <div class="mb-8">
          <img src="/logo.png" alt="Logo e-SKL" class="h-24 w-auto mx-auto object-contain drop-shadow-xl" />
        </div>
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-800/50 border border-indigo-500/30 text-indigo-100 text-sm font-medium mb-8 backdrop-blur-sm">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Pengumuman Kelulusan Resmi
        </div>
        
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          Cek Status Kelulusan <br class="hidden md:block" /> 
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-200">{{ schoolName }}</span>
        </h1>
        
        <p class="max-w-2xl text-lg md:text-xl text-indigo-200 mb-10 leading-relaxed font-light">
          Selamat datang di portal layanan digital. Silakan lengkapi data di bawah ini untuk melihat hasil kelulusan dan mengunduh Surat Keterangan Lulus (SKL) Anda secara aman.
        </p>
      </div>
    </div>

    <!-- Interactive Section -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 w-full pb-24">
      <!-- Search Card -->
      <div class="bg-white rounded-3xl shadow-2xl shadow-indigo-900/10 border border-slate-200/60 overflow-hidden backdrop-blur-xl">
        <div class="p-1">
          <div class="bg-slate-50/50 rounded-t-[22px] border-b border-slate-100 p-6 md:p-10">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                <Search class="w-6 h-6" />
              </div>
              <div>
                <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Cari Data Siswa</h2>
                <p class="text-slate-500 font-medium">Gunakan kredensial yang valid</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Nomor Induk Siswa Nasional (NISN)</label>
                <input v-model="form.nisn" type="text" placeholder="Contoh: 0012345678" class="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm font-medium" />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Tanggal Lahir</label>
                <input v-model="form.birth_date" type="date" class="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm font-medium" />
              </div>
            </div>
            
            <div class="mt-8">
              <button @click="search" :disabled="loading" class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 disabled:opacity-70 transition-all duration-300 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5">
                <span v-if="loading" class="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                <template v-else>
                  Lihat Hasil Kelulusan <ArrowRight class="w-5 h-5" />
                </template>
              </button>
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="error" class="p-6 md:p-10 bg-white">
            <div class="flex items-start gap-4 p-5 bg-red-50 text-red-800 rounded-2xl border border-red-100 shadow-inner">
              <div class="bg-red-100 p-2 rounded-full flex-shrink-0">
                <AlertCircle class="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h4 class="font-bold text-red-900 mb-1">Pencarian Gagal</h4>
                <p class="text-sm font-medium leading-relaxed opacity-90">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Result -->
          <div v-if="result" class="p-6 md:p-10 bg-white">
            <div class="text-center mb-10 pt-4">
              <div class="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 shadow-2xl relative"
                   :class="result.graduation_status === 'LULUS' ? 'bg-emerald-100 text-emerald-600 shadow-emerald-200/50' : 
                           result.graduation_status === 'TIDAK_LULUS' ? 'bg-red-100 text-red-600 shadow-red-200/50' : 'bg-amber-100 text-amber-600 shadow-amber-200/50'">
                <div class="absolute inset-0 rounded-full animate-ping opacity-20"
                     :class="result.graduation_status === 'LULUS' ? 'bg-emerald-400' : 
                             result.graduation_status === 'TIDAK_LULUS' ? 'bg-red-400' : 'bg-amber-400'"></div>
                <CheckCircle v-if="result.graduation_status === 'LULUS'" class="w-12 h-12 relative z-10" />
                <XCircle v-else-if="result.graduation_status === 'TIDAK_LULUS'" class="w-12 h-12 relative z-10" />
                <AlertCircle v-else class="w-12 h-12 relative z-10" />
              </div>
              <h3 class="text-4xl font-black tracking-tight mb-2" :class="result.graduation_status === 'LULUS' ? 'text-emerald-600' : result.graduation_status === 'TIDAK_LULUS' ? 'text-red-600' : 'text-amber-600'">
                {{ result.graduation_status === 'LULUS' ? 'SELAMAT, ANDA LULUS!' : result.graduation_status === 'TIDAK_LULUS' ? 'MOHON MAAF, ANDA TIDAK LULUS' : 'STATUS DITUNDA' }}
              </h3>
              <p class="text-slate-500 font-medium">Berdasarkan keputusan resmi rapat pleno kelulusan.</p>
            </div>

            <!-- Identitas Siswa -->
            <div class="bg-slate-50 rounded-3xl border border-slate-100 p-8 mb-8 relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-5">
                <FileText class="w-32 h-32" />
              </div>
              <h4 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-200 pb-3 relative z-10">Identitas Siswa</h4>
              <div class="space-y-5 relative z-10">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span class="text-slate-500 font-medium">Nama Lengkap</span>
                  <span class="font-bold text-slate-800 text-lg sm:text-right">{{ result.student.name }}</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span class="text-slate-500 font-medium">NISN</span>
                  <span class="font-bold font-mono text-indigo-600 text-lg sm:text-right">{{ result.student.nisn }}</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span class="text-slate-500 font-medium">Kelas / Jurusan</span>
                  <span class="font-bold text-slate-800 sm:text-right">{{ result.student.class || '-' }} / {{ result.student.major || '-' }}</span>
                </div>
              </div>
            </div>

            <!-- Alasan Tidak Bisa Download -->
            <div v-if="!result.can_download && result.reasons.length" class="bg-amber-50 border border-amber-200 rounded-3xl p-8 mb-8 shadow-inner">
              <div class="flex items-center gap-3 mb-5">
                <div class="bg-amber-100 p-2 rounded-lg">
                  <AlertCircle class="w-6 h-6 text-amber-600" />
                </div>
                <h4 class="text-amber-900 font-bold text-lg">SKL Belum Dapat Diunduh</h4>
              </div>
              <p class="text-amber-800 font-medium mb-4">Mohon maaf, dokumen SKL Anda tertahan karena hal berikut:</p>
              <ul class="space-y-3">
                <li v-for="reason in result.reasons" :key="reason" class="text-sm font-medium text-amber-900 flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-amber-100">
                  <XCircle class="w-5 h-5 text-amber-500 flex-shrink-0" /> 
                  <span>{{ reason }}</span>
                </li>
              </ul>
              <p class="text-xs text-amber-700 mt-5 font-medium">* Silakan selesaikan tanggungan di atas dengan pihak sekolah agar SKL dapat diunduh.</p>
            </div>

            <!-- Download Section -->
            <div v-if="result.can_download && result.skl.available" class="space-y-4 pt-4 border-t border-slate-100">
              <div class="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/60 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm">
                <!-- Decorative background elements -->
                <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
                
                <div class="relative z-10 text-center md:text-left">
                  <span class="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">Tersedia</span>
                  <h4 class="text-2xl font-black text-indigo-950 mb-2">Dokumen SKL Digital</h4>
                  <p class="text-indigo-800/80 font-medium">Dokumen ini resmi dan dilengkapi dengan QR Code untuk verifikasi keaslian.</p>
                </div>
                
                <a :href="downloadUrl(result.skl.verification_code)" target="_blank" class="relative z-10 w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-1 whitespace-nowrap">
                  <Download class="w-6 h-6" /> 
                  <span>Unduh Dokumen PDF</span>
                </a>
              </div>
              
              <div class="text-center mt-6">
                <button @click="router.push(`/verify/${result.skl.verification_code}`)" class="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors py-2 px-4 rounded-full hover:bg-slate-50">
                  <ShieldCheck class="w-4 h-4" /> Buka Halaman Verifikasi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
