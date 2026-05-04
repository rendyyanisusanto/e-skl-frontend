import api from './api'

export const checkSkl = (data) => api.post('/public/check-skl', data)
export const verifySkl = (code) => api.get(`/public/skl/verify/${code}`)
export const getDownloadUrl = (code) => `${import.meta.env.VITE_API_BASE_URL}/public/skl/download/${code}`
