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
-- RPC: 速率限制的弹幕发送 (每分钟最多30条全局)
-- ==========================================
create or replace function send_danmaku(p_content text, p_color text)
returns boolean
language plpgsql
security definer
as $$
declare
  recent_count int;
begin
  -- 校验内容
  if char_length(p_content) > 50 or char_length(p_content) = 0 then
    return false;
  end if;

  -- 全局速率限制: 每分钟最多 30 条
  select count(*) into recent_count
  from danmaku
  where created_at > now() - interval '1 minute';

  if recent_count >= 30 then
    return false;
  end if;

  insert into danmaku (content, color) values (p_content, p_color);
  return true;
end;
$$;

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
