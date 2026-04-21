-- Stores transactional checklist email requests.
-- Run this before deploying the send-checklist Edge Function.

create extension if not exists "uuid-ossp";

create table if not exists public.checklist_delivery_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  checklist_slug text not null,
  email text not null,
  status text default 'queued' not null check (status in ('queued', 'sent', 'failed')),
  provider text,
  provider_message_id text,
  error_message text,
  requested_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sent_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.checklist_delivery_requests enable row level security;

drop policy if exists "Users can view own checklist delivery requests" on public.checklist_delivery_requests;
drop policy if exists "Users can insert own checklist delivery requests" on public.checklist_delivery_requests;
drop policy if exists "Service role manages checklist delivery requests" on public.checklist_delivery_requests;

create policy "Users can view own checklist delivery requests"
  on public.checklist_delivery_requests for select
  using (auth.uid() = user_id);

create policy "Users can insert own checklist delivery requests"
  on public.checklist_delivery_requests for insert
  with check (auth.uid() = user_id);

create policy "Service role manages checklist delivery requests"
  on public.checklist_delivery_requests for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create index if not exists idx_checklist_delivery_requests_user
  on public.checklist_delivery_requests(user_id, requested_at desc);

create index if not exists idx_checklist_delivery_requests_status
  on public.checklist_delivery_requests(status, requested_at desc);
