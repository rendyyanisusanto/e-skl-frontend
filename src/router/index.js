import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  // Public
  { path: '/', name: 'CheckSKL', component: () => import('@/pages/public/CheckSKLPage.vue') },
  { path: '/verify/:verificationCode', name: 'VerifySKL', component: () => import('@/pages/public/VerifySKLPage.vue') },

  // Admin Login
  { path: '/admin/login', name: 'AdminLogin', component: () => import('@/pages/admin/LoginPage.vue'), meta: { guest: true } },

  // Admin Protected
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/pages/admin/DashboardPage.vue') },
      { path: 'graduation-periods', name: 'GraduationPeriods', component: () => import('@/pages/admin/GraduationPeriodsPage.vue') },
      { path: 'majors', name: 'Majors', component: () => import('@/pages/admin/MajorsPage.vue') },
      { path: 'classes', name: 'Classes', component: () => import('@/pages/admin/ClassesPage.vue') },
      { path: 'students', name: 'Students', component: () => import('@/pages/admin/StudentsPage.vue') },
      { path: 'students/:id', name: 'StudentDetail', component: () => import('@/pages/admin/StudentDetailPage.vue') },
      { path: 'bulk-process', name: 'BulkProcess', component: () => import('@/pages/admin/BulkProcessPage.vue') },
      { path: 'requirement-types', name: 'RequirementTypes', component: () => import('@/pages/admin/RequirementTypesPage.vue') },
      { path: 'download-logs', name: 'DownloadLogs', component: () => import('@/pages/admin/DownloadLogsPage.vue') },
      { path: 'verification-logs', name: 'VerificationLogs', component: () => import('@/pages/admin/VerificationLogsPage.vue') },
      { path: 'school-profile', name: 'SchoolProfile', component: () => import('@/pages/admin/SchoolProfilePage.vue') },
    ],
  },

  // 404 fallback
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next('/admin/login')
  }
  if (to.meta.guest && auth.isLoggedIn) {
    return next('/admin/dashboard')
  }
  next()
})

export default router
