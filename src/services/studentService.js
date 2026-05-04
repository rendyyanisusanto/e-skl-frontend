import api from './api'

export const getStudents = (params) => api.get('/admin/students', { params })
export const getStudent = (id) => api.get(`/admin/students/${id}`)
export const createStudent = (data) => api.post('/admin/students', data)
export const updateStudent = (id, data) => api.put(`/admin/students/${id}`, data)
export const deleteStudent = (id) => api.delete(`/admin/students/${id}`)
export const importStudents = (formData) => api.post('/admin/students/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const updateGraduationResult = (id, data) => api.put(`/admin/students/${id}/graduation-result`, data)

export const getRequirements = (id) => api.get(`/admin/students/${id}/requirements`)
export const updateRequirement = (id, reqTypeId, data) => api.put(`/admin/students/${id}/requirements/${reqTypeId}`, data)
export const bulkUpdateRequirements = (data) => api.put(`/admin/students/requirements/bulk`, data)
export const generateRequirements = (id) => api.post(`/admin/students/${id}/requirements/generate`)

export const uploadSkl = (id, formData) => api.post(`/admin/students/${id}/skl/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const getSkl = (id) => api.get(`/admin/students/${id}/skl`)
export const updateSkl = (id, data) => api.put(`/admin/students/${id}/skl`, data)
export const deleteSkl = (id) => api.delete(`/admin/students/${id}/skl`)
