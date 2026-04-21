-- First-month reminder email queue.
-- Run this after user_retention_state.sql in Supabase SQL Editor.

create extension if not exists "uuid-ossp";

alter table public.notification_preferences
  add column if not exists reminder_unsubscribed_at timestamp with time zone;

create table if not exists public.reminder_email_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  reminder_type text default 'first_month' not null,
  subject text not null,
  scheduled_for timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'queued' not null check (status in ('queued', 'sent', 'skipped', 'failed')),
  provider text,
  provider_message_id text,
  error_message text,
  sent_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reminder_email_events enable row level security;

drop policy if exists "Users can view own reminder email events" on public.reminder_email_events;
drop policy if exists "Service role manages reminder email events" on public.reminder_email_events;

create policy "Users can view own reminder email events"
  on public.reminder_email_events for select
  using (auth.uid() = user_id);

create policy "Service role manages reminder email events"
  on public.reminder_email_events for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create index if not exists idx_reminder_email_events_due
  on public.reminder_email_events(status, scheduled_for);

create index if not exists idx_reminder_email_events_user
  on public.reminder_email_events(user_id, created_at desc);

drop index if exists public.idx_reminder_email_events_once_per_day;

create unique index if not exists idx_reminder_email_events_once_per_subject
  on public.reminder_email_events(user_id, reminder_type, subject)
  where status in ('queued', 'sent');

create or replace function public.queue_first_month_reminders()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.first_month_reminders is true and new.reminder_unsubscribed_at is null then
    insert into public.reminder_email_events (user_id, reminder_type, subject, scheduled_for)
    values
      (new.user_id, 'first_month', 'Your Frankfurt setup checklist for this week', timezone('utc'::text, now()) + interval '1 day'),
      (new.user_id, 'first_month', 'Frankfurt setup reminder: documents, housing, and banking', timezone('utc'::text, now()) + interval '8 days'),
      (new.user_id, 'first_month', 'Frankfurt setup reminder: check what is still open', timezone('utc'::text, now()) + interval '15 days')
    on conflict do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists queue_first_month_reminders_on_preferences on public.notification_preferences;

create trigger queue_first_month_reminders_on_preferences
  after insert or update of first_month_reminders, reminder_unsubscribed_at
  on public.notification_preferences
  for each row
  execute function public.queue_first_month_reminders();
