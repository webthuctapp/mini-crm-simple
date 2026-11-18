export const money = (n) => Math.round(Number(n || 0)).toLocaleString('vi-VN') + 'đ'
export const fmtDate = (s) => new Date(s).toLocaleDateString('vi-VN')
export const fmtDateTime = (s) => (s ? new Date(s).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'Không có hạn')

export const DEAL_STATUS = { new: 'Mới', negotiating: 'Đang đàm phán', won: 'Thành công', lost: 'Thất bại' }
export const CUSTOMER_STATUS = { lead: 'Tiềm năng', active: 'Đang hợp tác', inactive: 'Ngừng' }
export const ACTIVITY_TYPE = { call: '📞 Gọi điện', message: '💬 Nhắn tin', meeting: '🤝 Gặp mặt', note: '📝 Ghi chú' }

export function taskBucket(t) {
  if (t.done) return 'done'
  if (!t.due_at) return 'upcoming'
  const d = new Date(t.due_at)
  const now = new Date()
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  if (d < now) return 'overdue'
  if (d <= endOfToday) return 'today'
  return 'upcoming'
}

const AVATAR_COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#db2777', '#0891b2']
export function avatarStyle(name = '') {
  const code = [...name].reduce((s, c) => s + c.charCodeAt(0), 0)
  return { background: AVATAR_COLORS[code % AVATAR_COLORS.length] }
}
export function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return (parts.length === 1 ? parts[0][0] : parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
