import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import { STAGE_PROB } from '../lib/format.js'

export default function Guide() {
  return (
    <>
      <PageHero icon="📖" title="Hướng dẫn & Giải thích" subtitle="Web này dành cho ai, các con số tính thế nào và thế nào là một cơ hội bán hàng." color="blue" />

      <div className="card section">
        <div className="section-head"><h3>👥 Ai là người mua? Ai là người dùng? Web làm cho ai?</h3></div>
        <p>
          <b>Mini CRM</b> là phần mềm <b>nội bộ</b> của một <b>doanh nghiệp / cửa hàng nhỏ bán hàng hoặc dịch vụ</b>,
          giúp nhân viên không bỏ sót khách và biết rõ tình hình bán hàng.
        </p>
        <table className="guide-table">
          <thead><tr><th>Vai trò</th><th>Là ai</th><th>Có đăng nhập web?</th><th>Làm gì / Được gì</th></tr></thead>
          <tbody>
            <tr>
              <td><b>🛒 Người mua</b></td>
              <td>Khách hàng của doanh nghiệp (cá nhân hoặc công ty)</td>
              <td>❌ Không</td>
              <td>Chỉ là <b>dữ liệu</b> trong trang Khách hàng; được nhân viên chăm sóc, báo giá, gọi lại.</td>
            </tr>
            <tr>
              <td><b>🧑‍💼 Người dùng web</b></td>
              <td>Nhân viên kinh doanh, chăm sóc khách hàng</td>
              <td>✅ Có</td>
              <td>Nhập khách, tạo cơ hội, ghi lịch sử chăm sóc, đặt nhắc việc, ghi nhận tiền khách trả.</td>
            </tr>
            <tr>
              <td><b>👔 Chủ / Quản lý</b></td>
              <td>Người điều hành doanh nghiệp</td>
              <td>✅ Có</td>
              <td>Xem trang Tổng quan: doanh thu, công nợ, cơ hội chờ chốt, tỉ lệ chốt để ra quyết định.</td>
            </tr>
          </tbody>
        </table>
        <p className="muted">👉 Tóm lại: <b>người mua</b> là khách của doanh nghiệp; <b>người dùng</b> là nhân viên/quản lý; web được làm <b>cho doanh nghiệp dùng nội bộ</b> để chăm sóc người mua.</p>
      </div>

      <div className="card section">
        <div className="section-head"><h3>🎯 Cơ hội là gì? Khi nào có cơ hội?</h3></div>
        <p>
          <b>Cơ hội (Opportunity)</b> là <b>một khả năng bán hàng cụ thể</b>: một khách đã thể hiện nhu cầu mua và ta có thể ước tính giá trị.
          Trong web, mỗi cơ hội chính là một <b>Giao dịch</b> ở trang Giao dịch.
        </p>
        <div className="steps">
          <div className="step"><span>1</span><div><b>Khách tiềm năng</b><p>Mới biết tên, số điện thoại. <b>Chưa phải cơ hội.</b></p></div></div>
          <div className="step"><span>2</span><div><b>Có cơ hội → tạo giao dịch (Mới)</b><p>Khi khách <b>hỏi giá, xin báo giá, hẹn demo</b>, nói rõ nhu cầu.</p></div></div>
          <div className="step"><span>3</span><div><b>Đang đàm phán</b><p>Đã báo giá, đang thương lượng giá, thời gian, điều khoản.</p></div></div>
          <div className="step"><span>4</span><div><b>Thành công / Thất bại</b><p>Khách đồng ý mua (chốt) hoặc từ chối. Thành công thì ghi nhận tiền thu.</p></div></div>
        </div>
        <p className="muted">Không phải khách “Tiềm năng” nào cũng đã có cơ hội. <b>Có cơ hội khi có nhu cầu thật + giá trị ước tính.</b> Một khách có thể có nhiều cơ hội cùng lúc.</p>
      </div>

      <div className="card section">
        <div className="section-head"><h3>⏳ “Đang chờ chốt” dựa vào đâu? Chờ chốt bao nhiêu?</h3></div>
        <p><b>Đang chờ chốt</b> = tổng <b>giá trị</b> của mọi cơ hội còn mở (cột <b>Mới</b> + <b>Đang đàm phán</b>). Đây là tiền <b>có thể</b> thu, <b>chưa phải doanh thu</b>.</p>
        <p><b>Kỳ vọng chốt</b> thực tế hơn vì nhân với xác suất của từng giai đoạn:</p>
        <table className="guide-table">
          <thead><tr><th>Giai đoạn</th><th>Xác suất ước tính</th><th>Ví dụ giá trị 10 triệu</th></tr></thead>
          <tbody>
            <tr><td>Mới</td><td>{STAGE_PROB.new * 100}%</td><td>10tr × {STAGE_PROB.new * 100}% = {10 * STAGE_PROB.new}tr</td></tr>
            <tr><td>Đang đàm phán</td><td>{STAGE_PROB.negotiating * 100}%</td><td>10tr × {STAGE_PROB.negotiating * 100}% = {10 * STAGE_PROB.negotiating}tr</td></tr>
          </tbody>
        </table>
        <p className="muted">Xác suất là <b>ước tính mặc định</b> để dự báo (có thể chỉnh trong code ở <code>STAGE_PROB</code>), không phải số liệu thật.</p>
      </div>

      <div className="card section">
        <div className="section-head"><h3>💰 Doanh thu, Đã thu và Công nợ (có người trả, có người nợ)</h3></div>
        <p>Doanh thu <b>không</b> đồng nghĩa với tiền đã vào túi. Web tách làm 3 con số:</p>
        <ul>
          <li><b>Doanh thu ghi nhận</b> = tổng giá trị các giao dịch đã <b>Thành công</b>.</li>
          <li><b>Đã thu</b> = số tiền khách <b>đã thực sự trả</b> (nhập ở thẻ giao dịch Thành công).</li>
          <li><b>Công nợ</b> = Doanh thu − Đã thu (khách còn nợ).</li>
        </ul>
        <div className="example">
          <b>Ví dụ:</b> có 2 khách giao dịch, tổng <b>20 triệu</b>. Khách A trả đủ <b>10 triệu</b>, khách B còn nợ <b>10 triệu</b> →
          <div className="example-nums">
            <span className="chip-g">Doanh thu 20tr</span>
            <span className="chip-t">Đã thu 10tr</span>
            <span className="chip-r">Công nợ 10tr</span>
          </div>
        </div>
        <p className="muted">Khi khách trả thêm, vào <Link to="/deals">Giao dịch</Link> → thẻ giao dịch Thành công → nhập số tiền → bấm <b>Thu</b> (hoặc <b>Thu đủ</b>).</p>
      </div>

      <div className="card section">
        <div className="section-head"><h3>📚 Bảng thuật ngữ nhanh</h3></div>
        <table className="guide-table">
          <thead><tr><th>Thuật ngữ</th><th>Ý nghĩa</th></tr></thead>
          <tbody>
            <tr><td>Khách hàng tiềm năng (lead)</td><td>Người mới liên hệ, chưa mua và chưa chắc có nhu cầu</td></tr>
            <tr><td>Đang hợp tác</td><td>Khách đã mua / đang làm việc với doanh nghiệp</td></tr>
            <tr><td>Ngừng</td><td>Khách từng hợp tác nhưng nay không còn</td></tr>
            <tr><td>Cơ hội / Giao dịch</td><td>Một khả năng bán hàng cụ thể cho một khách</td></tr>
            <tr><td>Chốt</td><td>Khách đồng ý mua (giao dịch Thành công)</td></tr>
            <tr><td>Tỉ lệ chốt</td><td>Thành công ÷ (Thành công + Thất bại)</td></tr>
            <tr><td>Lịch sử chăm sóc</td><td>Các lần gọi, nhắn, gặp khách đã ghi lại</td></tr>
            <tr><td>Nhắc việc</td><td>Việc cần làm có hạn (VD: gọi lại khách thứ Sáu)</td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
