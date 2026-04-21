-- Cross-device retention state for dashboard and public checklist lead magnet.
-- Run this once in Supabase SQL Editor.

create extension if not exists "uuid-ossp";

create table if not exists public.notification_preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  email_task_reminders boolean default true not null,
  email_payment_reminders boolean default false not null,
  first_month_reminders boolean default false not null,
  reminder_days text[] default array['monday']::text[] not null,
  reminder_time time default '09:00' not null,
  timezone text default 'Europe/Berlin' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.user_checklist_state (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  checklist_key text not null,
  completed_task_ids text[] default '{}'::text[] not null,
  saved boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, checklist_key)
);

alter table public.notification_preferences enable row level security;
alter table public.user_checklist_state enable row level security;

drop policy if exists "Users can view own notification preferences" on public.notification_preferences;
drop policy if exists "Users can insert own notification preferences" on public.notification_preferences;
drop policy if exists "Users can update own notification preferences" on public.notification_preferences;
drop policy if exists "Users can view own checklist state" on public.user_checklist_state;
drop policy if exists "Users can insert own checklist state" on public.user_checklist_state;
drop policy if exists "Users can update own checklist state" on public.user_checklist_state;
drop policy if exists "Users can delete own checklist state" on public.user_checklist_state;

create policy "Users can view own notification preferences"
  on public.notification_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert own notification preferences"
  on public.notification_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own notification preferences"
  on public.notification_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can view own checklist state"
  on public.user_checklist_state for select
  using (auth.uid() = user_id);

create policy "Users can insert own checklist state"
  on public.user_checklist_state for insert
  with check (auth.uid() = user_id);

create policy "Users can update own checklist state"
  on public.user_checklist_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own checklist state"
  on public.user_checklist_state for delete
  using (auth.uid() = user_id);

create index if not exists idx_notification_preferences_user_id
  on public.notification_preferences(user_id);

create index if not exists idx_user_checklist_state_user_id
  on public.user_checklist_state(user_id);

create index if not exists idx_user_checklist_state_lookup
  on public.user_checklist_state(user_id, checklist_key);

-- Keep this alter for projects that already created notification_preferences earlier.
alter table public.notification_preferences
  add column if not exists first_month_reminders boolean default false not null;
