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
