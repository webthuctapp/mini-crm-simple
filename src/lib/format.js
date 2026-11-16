export const money = (n) => Math.round(Number(n || 0)).toLocaleString('vi-VN') + 'đ'
export const fmtDate = (s) => new Date(s).toLocaleDateString('vi-VN')

export const DEAL_STATUS = { new: 'Mới', negotiating: 'Đang đàm phán', won: 'Thành công', lost: 'Thất bại' }
export const CUSTOMER_STATUS = { lead: 'Tiềm năng', active: 'Đang hợp tác', inactive: 'Ngừng' }
