# Kịch bản thuyết trình — Mini CRM

**Link demo:** https://mini-crm-simple.pages.dev  
**Nhóm thực hiện:** webthuctapp  
**Thời lượng dự kiến:** 3 – 4 phút

---

## Mẹo nhớ nhanh (5 ý cốt lõi)
1. **Lý do:** Sổ tay / Excel / Zalo rời rạc → gom về 1 web duy nhất.
2. **Công nghệ:** React + Vite (giao diện), Supabase/PostgreSQL (dữ liệu + đăng nhập), Cloudflare Pages (hosting), GitHub Desktop (nhánh → Pull Request → `main`).
3. **Database:** 4 bảng (`customers`, `deals`, `activities`, `tasks`) + bảo mật RLS.
4. **4 trang chính:** Tổng quan (KPI + biểu đồ) → Khách hàng (+ lịch sử chăm sóc) → Giao dịch (Kanban 4 cột) → Nhắc việc (Quá hạn / Hôm nay).
5. **Mở rộng:** Phân quyền Quản lý/Nhân viên, xuất Excel, kéo thả Kanban.

---

## Lời nói chi tiết theo từng Slide

### Slide 1 — Chào hỏi & Giới thiệu
> Em chào thầy/cô và các bạn. Hôm nay em xin đại diện nhóm `webthuctapp` trình bày đồ án **Mini CRM — Hệ thống Quản lý Khách hàng và Bán hàng**, hiện đã chạy trực tuyến tại `mini-crm-simple.pages.dev`.

### Slide 2 — Lý do chọn đề tài (Bài toán & Giải pháp)
> Thực tế ở các cửa hàng hay doanh nghiệp nhỏ, thông tin khách hàng thường nằm rời rạc ở sổ tay, Excel hay Zalo. Việc này rất dễ làm quên lịch chăm sóc khách, mất dữ liệu khi đổi nhân sự và khó biết ngay doanh thu đang có.  
> Vì vậy nhóm em xây dựng **Mini CRM** để gom toàn bộ **khách hàng, giao dịch, lịch sử chăm sóc và nhắc việc** về một trang web duy nhất, có đăng nhập bảo mật.

### Slide 3 — Công nghệ & Quy trình làm việc
> Về công nghệ, tụi em sử dụng **React + Vite** cho giao diện mượt mà; **Supabase (PostgreSQL)** làm cơ sở dữ liệu và xác thực đăng nhập; và triển khai miễn phí lên **Cloudflare Pages**.  
> Trong quá trình làm nhóm, tụi em quản lý mã nguồn bằng **GitHub Desktop**, mỗi tính năng làm trên một nhánh riêng rồi tạo Pull Request gộp vào nhánh `main`, khi đó Cloudflare sẽ tự động cập nhật bản mới lên web.

### Slide 4 — Cơ sở dữ liệu (4 bảng)
> Hệ thống gồm **4 bảng chính** trên PostgreSQL:
> - `customers`: lưu thông tin và trạng thái khách hàng.
> - `deals`: lưu các giao dịch bán hàng, gắn với khách hàng.
> - `activities`: lưu lịch sử các lần gọi điện, nhắn tin, gặp mặt.
> - `tasks`: lưu nhắc việc và lịch hẹn theo ngày giờ.
>
> Cả 4 bảng đều bật bảo mật RLS, chỉ nhân viên đã đăng nhập mới đọc và ghi được dữ liệu.

### Slide 5 — Đăng nhập & Bảo mật
> Đây là màn hình **Đăng nhập** thực tế của hệ thống dùng Supabase Auth. Tụi em tắt tính năng tự đăng ký bên ngoài, chỉ tài khoản do quản lý cấp mới vào được, giúp bảo vệ dữ liệu khách hàng. Ngoài ra web vẫn có chế độ demo bằng `localStorage` để chạy thử khi không có mạng.

### Slide 6 — Trang Tổng quan (Dashboard)
> Sau khi đăng nhập sẽ vào trang **Tổng quan**. Ở đây hiển thị ngay **5 chỉ số quan trọng**: số khách hàng, số giao dịch, doanh thu đã chốt, tiền đang chờ chốt và tỉ lệ thành công. Bên dưới có khung **Nhắc việc cần chú ý** để tick hoàn thành ngay, cùng biểu đồ trạng thái trực quan.

### Slide 7 — Trang Khách hàng
> Ở trang **Khách hàng**, nhân viên có thể thêm, sửa, xoá thông tin, tìm kiếm nhanh theo tên, công ty, số điện thoại và lọc theo 3 trạng thái: **Tiềm năng, Đang hợp tác, và Ngừng**. Khi bấm vào tên một khách sẽ mở ra hồ sơ chi tiết.

### Slide 8 — Chi tiết & Lịch sử chăm sóc
> Trong trang **Chi tiết khách hàng**, nhân viên ghi lại toàn bộ **dòng thời gian chăm sóc** như gọi điện, nhắn tin, gặp mặt để không bị quên nội dung trao đổi trước đó. Đồng thời có thể tạo nhắc việc và xem tất cả giao dịch của riêng khách này.

### Slide 9 — Bảng Giao dịch Kanban
> Trang **Giao dịch** thiết kế dạng **bảng Kanban 4 cột**: *Mới → Đang đàm phán → Thành công → Thất bại*. Mỗi cột tự động cộng tổng số đơn và tổng tiền, giúp theo dõi tiến độ bán hàng rất nhanh.

### Slide 10 — Trang Nhắc việc & Kết luận
> Cuối cùng là trang **Nhắc việc**, hệ thống tự chia việc làm 4 nhóm: **Quá hạn (màu đỏ), Hôm nay (màu vàng), Sắp tới và Đã xong** để nhân viên không bỏ sót khách hàng.  
> Trong tương lai, nhóm dự kiến phát triển thêm **phân quyền Quản lý / Nhân viên**, **xuất file Excel** và **kéo thả thẻ giao dịch**.  
> Phần trình bày của nhóm em đến đây là hết, em cảm ơn thầy/cô và các bạn đã lắng nghe!
