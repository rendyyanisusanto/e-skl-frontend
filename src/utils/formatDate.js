import dayjs from 'dayjs'
import 'dayjs/locale/id'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.locale('id')

export const formatDate = (date, fmt = 'DD MMM YYYY') => date ? dayjs(date).format(fmt) : '-'
export const formatDateTime = (date) => date ? dayjs(date).format('DD MMM YYYY HH:mm') : '-'
export const formatDateInput = (date) => date ? dayjs(date).format('YYYY-MM-DD') : ''
export const formatDateTimeInput = (date) => date ? dayjs(date).format('YYYY-MM-DDTHH:mm') : ''
export const fromNow = (date) => date ? dayjs(date).fromNow() : '-'
