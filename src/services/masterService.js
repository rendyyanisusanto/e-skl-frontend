import api from './api'

// Dashboard
export const getDashboard = (params) => api.get('/admin/dashboard', { params })

// Graduation Periods
export const getPeriods = () => api.get('/admin/graduation-periods')
export const getPeriod = (id) => api.get(`/admin/graduation-periods/${id}`)
export const createPeriod = (data) => api.post('/admin/graduation-periods', data)
export const updatePeriod = (id, data) => api.put(`/admin/graduation-periods/${id}`, data)
export const deletePeriod = (id) => api.delete(`/admin/graduation-periods/${id}`)

// Majors
export const getMajors = () => api.get('/admin/majors')
export const getMajor = (id) => api.get(`/admin/majors/${id}`)
export const createMajor = (data) => api.post('/admin/majors', data)
export const updateMajor = (id, data) => api.put(`/admin/majors/${id}`, data)
export const deleteMajor = (id) => api.delete(`/admin/majors/${id}`)

// Classes
export const getClasses = (params) => api.get('/admin/classes', { params })
export const getClass = (id) => api.get(`/admin/classes/${id}`)
export const createClass = (data) => api.post('/admin/classes', data)
export const updateClass = (id, data) => api.put(`/admin/classes/${id}`, data)
export const deleteClass = (id) => api.delete(`/admin/classes/${id}`)

// Requirement Types
export const getRequirementTypes = (params) => api.get('/admin/requirement-types', { params })
export const getRequirementType = (id) => api.get(`/admin/requirement-types/${id}`)
export const createRequirementType = (data) => api.post('/admin/requirement-types', data)
export const updateRequirementType = (id, data) => api.put(`/admin/requirement-types/${id}`, data)
export const deleteRequirementType = (id) => api.delete(`/admin/requirement-types/${id}`)

// Download & Verification Logs
export const getDownloadLogs = (params) => api.get('/admin/download-logs', { params })
export const getVerificationLogs = (params) => api.get('/admin/verification-logs', { params })

// School Profile
export const getSchoolProfile = () => api.get('/admin/school-profile')
export const updateSchoolProfile = (data) => api.put('/admin/school-profile', data)
