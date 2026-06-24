create extension if not exists "pgcrypto";

create schema if not exists app;

create or replace function app.is_admin_email()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) =
         lower(coalesce(current_setting('app.admin_email', true), ''))
$$;

create table if not exists public.portfolio_profile (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  education text,
  grad text,
  resume_url text,
  updated_at timestamptz default now()
);

create table if not exists public.portfolio_skills (
  id uuid primary key default gen_random_uuid(),
  skill_group text not null,
  items text not null,
  order_index integer default 0,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_portfolio_profile_updated_at on public.portfolio_profile;
create trigger set_portfolio_profile_updated_at
before update on public.portfolio_profile
for each row execute function public.set_updated_at();

drop trigger if exists set_portfolio_skills_updated_at on public.portfolio_skills;
create trigger set_portfolio_skills_updated_at
before update on public.portfolio_skills
for each row execute function public.set_updated_at();

alter table public.portfolio_profile enable row level security;
alter table public.portfolio_skills enable row level security;

drop policy if exists "Public can read portfolio profile" on public.portfolio_profile;
create policy "Public can read portfolio profile"
on public.portfolio_profile
for select
using (true);

drop policy if exists "Admin can update portfolio profile" on public.portfolio_profile;
create policy "Admin can update portfolio profile"
on public.portfolio_profile
for update
using (app.is_admin_email())
with check (app.is_admin_email());

drop policy if exists "Public can read published portfolio skills" on public.portfolio_skills;
create policy "Public can read published portfolio skills"
on public.portfolio_skills
for select
using (is_published = true or app.is_admin_email());

drop policy if exists "Admin can insert portfolio skills" on public.portfolio_skills;
create policy "Admin can insert portfolio skills"
on public.portfolio_skills
for insert
with check (app.is_admin_email());

drop policy if exists "Admin can update portfolio skills" on public.portfolio_skills;
create policy "Admin can update portfolio skills"
on public.portfolio_skills
for update
using (app.is_admin_email())
with check (app.is_admin_email());

drop policy if exists "Admin can delete portfolio skills" on public.portfolio_skills;
create policy "Admin can delete portfolio skills"
on public.portfolio_skills
for delete
using (app.is_admin_email());

insert into public.portfolio_profile (
  name,
  role,
  education,
  grad,
  resume_url
)
select
  'Kunjoong "Charlie" Kim',
  'CS @ Penn State · SWE / Business Systems',
  'Penn State · B.S. Computer Science · Math minor',
  'Expected May 2027 · GPA 3.7',
  'https://drive.google.com/file/d/1WzmfO4L1RtpVr2jOr15AoHt4gZ9gZ7Md/view'
where not exists (select 1 from public.portfolio_profile);

insert into public.portfolio_skills (
  skill_group,
  items,
  order_index,
  is_published
)
select *
from (
  values
    ('Languages', 'TypeScript, JavaScript, Python, Java, C, SQL', 0, true),
    ('Web', 'React, Next.js, NestJS, Tailwind CSS, Firebase, Supabase', 1, true),
    ('Data / ML', 'PyTorch, OpenCV, NumPy, Pandas, Computer Vision', 2, true),
    ('Business Systems', 'Workflow Automation, Requirements Analysis, REST APIs, MSSQL', 3, true)
) as seed(skill_group, items, order_index, is_published)
where not exists (select 1 from public.portfolio_skills);

-- Run this once in Supabase SQL editor with your admin email:
-- alter database postgres set app.admin_email = 'you@example.com';
