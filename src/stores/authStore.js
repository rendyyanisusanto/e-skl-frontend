import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isLoggedIn = computed(() => !!token.value)

  const setAuth = (data) => {
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const fetchMe = async () => {
    try {
      const res = await api.get('/admin/auth/me')
      user.value = res.data.data
      localStorage.setItem('user', JSON.stringify(res.data.data))
    } catch {
      clearAuth()
    }
  }

  return { token, user, isLoggedIn, setAuth, clearAuth, fetchMe }
})
