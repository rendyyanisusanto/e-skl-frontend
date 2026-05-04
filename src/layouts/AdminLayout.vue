<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { logout } from '@/services/authService'
import {
  LayoutDashboard, GraduationCap, BookOpen, School, Users,
  ClipboardList, Download, ShieldCheck, Building2, LogOut, Menu, X, ChevronRight, ListChecks
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const sidebarOpen = ref(true)
const loggingOut = ref(false)

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Periode Kelulusan', to: '/admin/graduation-periods', icon: GraduationCap },
  { label: 'Jurusan', to: '/admin/majors', icon: BookOpen },
  { label: 'Kelas', to: '/admin/classes', icon: School },
  { label: 'Data Siswa', to: '/admin/students', icon: Users },
  { label: 'Proses Massal', to: '/admin/bulk-process', icon: ListChecks },
  { label: 'Syarat SKL', to: '/admin/requirement-types', icon: ClipboardList },
  { label: 'Log Download', to: '/admin/download-logs', icon: Download },
  { label: 'Log Verifikasi', to: '/admin/verification-logs', icon: ShieldCheck },
  { label: 'Profil Sekolah', to: '/admin/school-profile', icon: Building2 },
]

const isActive = (to) => route.path.startsWith(to)

const handleLogout = async () => {
  loggingOut.value = true
  try { await logout() } finally {
    auth.clearAuth()
    router.push('/admin/login')
  }
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-slate-50">
    <!-- Sidebar -->
    <aside :class="['flex flex-col bg-slate-900 transition-all duration-300 flex-shrink-0', sidebarOpen ? 'w-64' : 'w-16']">
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 py-5 border-b border-white/10 min-h-[64px]">
        <div class="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <img src="/logo.png" alt="Logo" class="w-full h-full object-contain" />
        </div>
        <Transition name="fade">
          <div v-if="sidebarOpen" class="overflow-hidden">
            <p class="font-bold text-white text-sm leading-tight">E-SKL</p>
            <p class="text-slate-400 text-xs">Edulite Kelulusan</p>
          </div>
        </Transition>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="isActive(item.to) ? 'sidebar-item-active' : 'sidebar-item-inactive'"
          :title="!sidebarOpen ? item.label : ''"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <Transition name="fade">
            <span v-if="sidebarOpen" class="truncate">{{ item.label }}</span>
          </Transition>
        </RouterLink>
      </nav>

      <!-- User & Logout -->
      <div class="border-t border-white/10 p-3">
        <div v-if="sidebarOpen" class="flex items-center gap-3 px-2 py-2 mb-2">
          <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {{ auth.user?.name?.charAt(0)?.toUpperCase() || 'A' }}
          </div>
          <div class="overflow-hidden">
            <p class="text-white text-sm font-medium truncate">{{ auth.user?.name }}</p>
            <p class="text-slate-400 text-xs truncate">{{ auth.user?.role }}</p>
          </div>
        </div>
        <button @click="handleLogout" :disabled="loggingOut" class="sidebar-item-inactive w-full justify-start" :title="!sidebarOpen ? 'Logout' : ''">
          <LogOut class="w-5 h-5 flex-shrink-0" />
          <span v-if="sidebarOpen">{{ loggingOut ? 'Keluar...' : 'Logout' }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Topbar -->
      <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
          <Menu v-if="!sidebarOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
        <div class="flex items-center gap-2 text-sm text-slate-400">
          <span>E-SKL Admin</span>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
