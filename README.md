# Mini CRM (simple)

Tech: **React + Vite** (frontend), **Supabase / Postgres** (backend), deploy bằng Vercel/Netlify.
Không có `.env` thì app chạy chế độ demo bằng localStorage.

## Chạy
```
npm install
npm run dev
```

## Kết nối Supabase
1. Tạo project trên supabase.com → SQL Editor → chạy `supabase/schema.sql`.
2. Copy `.env.example` thành `.env`, điền URL và anon key.

## Quy trình GitHub Desktop (theo ảnh)
`main` là nhánh chính. Mỗi page làm trên 1 nhánh rồi merge vào main:
1. `page/dashboard` → `src/pages/Dashboard.jsx`
2. `page/customers` → `src/pages/Customers.jsx`
3. `page/deals` → `src/pages/Deals.jsx`

## Hosting
Đẩy lên GitHub → import vào Vercel → thêm biến `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Build: `npm run build`, output: `dist` (`vercel.json` đã rewrite SPA).
