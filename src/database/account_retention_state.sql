-- Cross-device account workspace state.
-- Run after the core schema if you are updating an existing Supabase project.

create extension if not exists "uuid-ossp";

with ranked_profiles as (
  select id, row_number() over (partition by user_id order by updated_at desc, created_at desc, id desc) as rn
  from public.user_profiles
)
delete from public.user_profiles
where id in (select id from ranked_profiles where rn > 1);

with ranked_plans as (
  select id, row_number() over (partition by user_id order by updated_at desc, generated_at desc, id desc) as rn
  from public.user_plans
)
delete from public.user_plans
where id in (select id from ranked_plans where rn > 1);

create unique index if not exists idx_user_profiles_user_id_unique
  on public.user_profiles(user_id);

create unique index if not exists idx_user_plans_user_id_unique
  on public.user_plans(user_id);

create table if not exists public.user_document_checklist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  document_id text not null,
  name text not null,
  description text,
  ready boolean default false not null,
  notes text default '' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, document_id)
);

alter table public.user_document_checklist enable row level security;

drop policy if exists "Users can view own document checklist" on public.user_document_checklist;
drop policy if exists "Users can insert own document checklist" on public.user_document_checklist;
drop policy if exists "Users can update own document checklist" on public.user_document_checklist;
drop policy if exists "Users can delete own document checklist" on public.user_document_checklist;

create policy "Users can view own document checklist"
  on public.user_document_checklist for select
  using (auth.uid() = user_id);

create policy "Users can insert own document checklist"
  on public.user_document_checklist for insert
  with check (auth.uid() = user_id);

create policy "Users can update own document checklist"
  on public.user_document_checklist for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own document checklist"
  on public.user_document_checklist for delete
  using (auth.uid() = user_id);

create index if not exists idx_user_document_checklist_user_id
  on public.user_document_checklist(user_id);

create index if not exists idx_user_document_checklist_lookup
  on public.user_document_checklist(user_id, document_id);
