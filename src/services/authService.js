import api from './api'

export const login = (data) => api.post('/admin/auth/login', data)
export const logout = () => api.post('/admin/auth/logout')
export const getMe = () => api.get('/admin/auth/me')
