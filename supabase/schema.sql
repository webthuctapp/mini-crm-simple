-- Chạy trong Supabase > SQL Editor (project mới)
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  phone text,
  email text,
  status text not null default 'lead',  -- lead | active | inactive
  note text,
  created_at timestamptz default now()
);

create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  title text not null,
  amount numeric not null default 0,    -- giá trị giao dịch (tổng tiền khách phải trả)
  paid_amount numeric not null default 0, -- số tiền khách đã trả (công nợ = amount - paid_amount)
  status text not null default 'new',   -- new | negotiating | won | lost
  created_at timestamptz default now()
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  type text not null default 'call',    -- call | message | meeting | note
  content text not null,
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  title text not null,
  due_at timestamptz,
  done boolean not null default false,
  created_at timestamptz default now()
);

-- Chỉ người đã đăng nhập mới đọc/ghi được
alter table customers enable row level security;
alter table deals enable row level security;
alter table activities enable row level security;
alter table tasks enable row level security;
create policy "staff customers" on customers for all to authenticated using (true) with check (true);
create policy "staff deals" on deals for all to authenticated using (true) with check (true);
create policy "staff activities" on activities for all to authenticated using (true) with check (true);
create policy "staff tasks" on tasks for all to authenticated using (true) with check (true);

-- Tạo tài khoản: Supabase > Authentication > Users > Add user
-- (nên tắt "Allow new users to sign up" để người lạ không tự đăng ký)

-- Cấp quyền cho người đã đăng nhập (nếu thiếu sẽ báo "permission denied for table")
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.customers, public.deals, public.activities, public.tasks to authenticated;
