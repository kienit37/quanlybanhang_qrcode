-- Chạy các lệnh này trong mục SQL Editor trên Dashboard của Supabase

-- 1. Tạo bảng Menu
create table public.menu_items (
  id text primary key,
  name text not null,
  price numeric not null,
  category text not null,
  image text,
  description text,
  available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Tạo bảng Orders
create table public.orders (
  id text primary key,
  table_id text not null,
  customer_name text,
  items jsonb not null, -- Lưu danh sách món dưới dạng JSON
  total numeric not null,
  status text not null default 'pending', -- pending, preparing, completed, cancelled
  note text,
  timestamp bigint, -- Lưu timestamp lúc đặt
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Bật Realtime cho 2 bảng này (QUAN TRỌNG ĐỂ CÁC MÁY TỰ ĐỒNG BỘ)
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.menu_items;

-- 4. Thêm dữ liệu mẫu cho Menu
insert into public.menu_items (id, name, price, category, image, description, available)
values 
  ('5', 'Bánh Flan', 15000, 'dessert', 'https://picsum.photos/400/300?random=5', 'Mềm mịn, béo ngậy trứng sữa.', true);

-- 5. Cài đặt bảo mật (RLS) - Cho phép Anon Key đọc/ghi (LƯU Ý: Chỉ dùng cho Demo/MVP)
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;

-- Policy cho Menu (Ai cũng xem được, Ai cũng sửa được vì Admin dùng chung key)
create policy "Enable all access for all users" on public.menu_items
for all using (true) with check (true);

-- Policy cho Orders (Ai cũng tạo được, Ai cũng sửa được)
create policy "Enable all access for all users" on public.orders
for all using (true) with check (true);
