<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { login } from '@/services/authService'
import { getErrorMessage } from '@/utils/helpers'
import { GraduationCap, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const form = ref({ username: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPw = ref(false)

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) { error.value = 'Username dan password wajib diisi.'; return }
  loading.value = true
  error.value = ''
  try {
    const res = await login(form.value)
    auth.setAuth(res.data.data)
    router.push('/admin/dashboard')
  } catch (err) {
    error.value = getErrorMessage(err, 'Login gagal.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-24 h-24 mb-2">
          <img src="/logo.png" alt="Logo" class="w-full h-full object-contain drop-shadow-xl" />
        </div>
        <h1 class="text-2xl font-bold text-white">E-SKL Admin</h1>
        <p class="text-slate-400 text-sm mt-1">Edulite SKL Digital</p>
      </div>

      <!-- Card -->
      <div class="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
        <h2 class="text-lg font-semibold text-white mb-6">Masuk ke Dashboard</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
            <input v-model="form.username" type="text" placeholder="Masukkan username" class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPw ? 'text' : 'password'" placeholder="Masukkan password" class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-12" />
              <button type="button" @click="showPw = !showPw" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <Eye v-if="!showPw" class="w-5 h-5" /><EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div v-if="error" class="text-sm text-red-400 bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20">{{ error }}</div>

          <button type="submit" :disabled="loading" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-900/30 mt-2">
            <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {{ loading ? 'Masuk...' : 'Masuk' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
