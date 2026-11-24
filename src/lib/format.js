export const money = (n) => Math.round(Number(n || 0)).toLocaleString('vi-VN') + 'đ'
export const fmtDate = (s) => new Date(s).toLocaleDateString('vi-VN')
export const fmtDateTime = (s) => (s ? new Date(s).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'Không có hạn')

export const DEAL_STATUS = { new: 'Mới', negotiating: 'Đang đàm phán', won: 'Thành công', lost: 'Thất bại' }
export const CUSTOMER_STATUS = { lead: 'Tiềm năng', active: 'Đang hợp tác', inactive: 'Ngừng' }
export const ACTIVITY_TYPE = { call: '📞 Gọi điện', message: '💬 Nhắn tin', meeting: '🤝 Gặp mặt', note: '📝 Ghi chú' }

// Ý nghĩa từng giai đoạn của một cơ hội bán hàng
export const DEAL_HINT = {
  new: 'Khách vừa có nhu cầu / hỏi giá',
  negotiating: 'Đã báo giá, đang thương lượng',
  won: 'Khách đồng ý mua (đã chốt)',
  lost: 'Khách từ chối / không mua nữa',
}

// Xác suất chốt ước tính theo giai đoạn (dùng để tính "Kỳ vọng chốt")
export const STAGE_PROB = { new: 0.2, negotiating: 0.5 }

// ----- Thanh toán / công nợ -----
export const PAY_STATUS = { paid: 'Đã thanh toán', partial: 'Thanh toán một phần', unpaid: 'Chưa thanh toán' }
export const paidOf = (d) => Math.min(Number(d.paid_amount || 0), Number(d.amount || 0))
export const debtOf = (d) => Math.max(Number(d.amount || 0) - paidOf(d), 0)
export function payStatus(d) {
  const amt = Number(d.amount || 0)
  const paid = paidOf(d)
  if (amt > 0 && paid >= amt) return 'paid'
  if (paid > 0) return 'partial'
  return 'unpaid'
}

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
