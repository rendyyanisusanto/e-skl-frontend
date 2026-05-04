export const getErrorMessage = (err, fallback = 'Terjadi kesalahan.') => {
  return err?.response?.data?.message || err?.message || fallback
}

export const getStatusBadge = (status) => {
  const map = {
    LULUS: 'badge-green',
    TIDAK_LULUS: 'badge-red',
    DITUNDA: 'badge-yellow',
    ACTIVE: 'badge-green',
    LOCKED: 'badge-blue',
    VOID: 'badge-gray',
    PENDING: 'badge-yellow',
    COMPLETED: 'badge-green',
    REJECTED: 'badge-red',
    WAIVED: 'badge-purple',
    PROCESSING: 'badge-blue',
    SUCCESS: 'badge-green',
    FAILED: 'badge-red',
  }
  return map[status] || 'badge-gray'
}

export const getStatusLabel = (status) => {
  const map = {
    LULUS: 'Lulus',
    TIDAK_LULUS: 'Tidak Lulus',
    DITUNDA: 'Ditunda',
    ACTIVE: 'Aktif',
    LOCKED: 'Terkunci',
    VOID: 'Void',
    PENDING: 'Belum',
    COMPLETED: 'Selesai',
    REJECTED: 'Ditolak',
    WAIVED: 'Dibebaskan',
    PROCESSING: 'Proses',
    SUCCESS: 'Berhasil',
    FAILED: 'Gagal',
  }
  return map[status] || status
}

export const formatFileSize = (bytes) => {
  if (!bytes) return '-'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
