-- ==========================================
-- 弹幕表
-- ==========================================
create table danmaku (
  id bigint generated always as identity primary key,
  content text not null check (char_length(content) <= 50),
  color text not null default '#ffffff',
  created_at timestamptz not null default now()
);

-- RLS
alter table danmaku enable row level security;

create policy "Anyone can read danmaku"
  on danmaku for select
  to anon
  using (true);

create policy "Anyone can insert danmaku"
  on danmaku for insert
  to anon
  with check (char_length(content) <= 50);

-- ==========================================
-- 访问计数表
-- ==========================================
create table visit_counter (
  id int primary key default 1 check (id = 1),
  count bigint not null default 0
);

-- 插入初始行
insert into visit_counter (id, count) values (1, 0);

-- RLS
alter table visit_counter enable row level security;

create policy "Anyone can read visit_counter"
  on visit_counter for select
  to anon
  using (true);

-- ==========================================
-- RPC: 原子递增访问计数
-- ==========================================
create or replace function increment_visit()
returns bigint
language sql
security definer
as $$
  update visit_counter set count = count + 1 where id = 1 returning count;
$$;
