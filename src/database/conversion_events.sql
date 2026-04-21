-- Consent-gated conversion event table.
-- Client code inserts only after analytics consent is granted.

create extension if not exists "uuid-ossp";

create table if not exists public.conversion_events (
  id uuid default uuid_generate_v4() primary key,
  event_name text not null,
  visitor_id text not null,
  user_id uuid references auth.users(id) on delete set null,
  page_path text,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.conversion_events enable row level security;

drop policy if exists "Clients can insert consented conversion events" on public.conversion_events;
drop policy if exists "Service role can view conversion events" on public.conversion_events;

create policy "Clients can insert consented conversion events"
  on public.conversion_events for insert
  with check (user_id is null or auth.uid() = user_id);

create policy "Service role can view conversion events"
  on public.conversion_events for select
  using (auth.role() = 'service_role');

create index if not exists idx_conversion_events_name_created
  on public.conversion_events(event_name, created_at desc);

create index if not exists idx_conversion_events_visitor_created
  on public.conversion_events(visitor_id, created_at desc);

create index if not exists idx_conversion_events_user_created
  on public.conversion_events(user_id, created_at desc);
