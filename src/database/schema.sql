-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Users Table (Public profile info synced with Auth)
-- -----------------------------------------------------------------------------
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  arrival_date date,
  visa_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Keep public.users in sync with Supabase Auth so onboarding/profile writes
-- have a parent user row even when email confirmation is required.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.users.full_name),
        updated_at = timezone('utc'::text, now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- -----------------------------------------------------------------------------
-- 2. User Profiles (Onboarding status and misc data)
-- -----------------------------------------------------------------------------
create table if not exists public.user_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  onboarding_completed boolean default false,
  profile_data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create unique index if not exists idx_user_profiles_user_id_unique
  on public.user_profiles(user_id);

-- -----------------------------------------------------------------------------
-- 3. User Plans (The generated relocation plan)
-- -----------------------------------------------------------------------------
create table if not exists public.user_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  plan_data jsonb default '[]'::jsonb,
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create unique index if not exists idx_user_plans_user_id_unique
  on public.user_plans(user_id);

-- -----------------------------------------------------------------------------
-- 4. Subscriptions (Linked to Stripe)
-- -----------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  stripe_subscription_id text,
  tier text default 'Free', -- Free, Pro, Move-In Pack
  status text default 'active',
  billing_period text,
  renewal_price integer default 0,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------
-- 5. Payments (History)
-- -----------------------------------------------------------------------------
create table if not exists public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  stripe_payment_id text,
  amount integer,
  currency text default 'EUR',
  status text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create unique index if not exists idx_subscriptions_stripe_subscription_id
  on public.subscriptions(stripe_subscription_id)
  where stripe_subscription_id is not null;

-- -----------------------------------------------------------------------------
-- 6. User Tasks (Tracking completion of individual tasks)
-- -----------------------------------------------------------------------------
create table if not exists public.user_tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  task_id text not null,
  status text default 'pending', -- pending, completed
  completed_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------
-- 7a. User Checklist State (Cross-device checklist retention)
-- -----------------------------------------------------------------------------
create table if not exists public.notification_preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  email_task_reminders boolean default true not null,
  email_payment_reminders boolean default false not null,
  first_month_reminders boolean default false not null,
  reminder_days text[] default array['monday']::text[] not null,
  reminder_time time default '09:00' not null,
  timezone text default 'Europe/Berlin' not null,
  reminder_unsubscribed_at timestamp with time zone,
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

create table if not exists public.conversion_events (
  id uuid default uuid_generate_v4() primary key,
  event_name text not null,
  visitor_id text not null,
  user_id uuid references auth.users(id) on delete set null,
  page_path text,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.blog_topic_queue (
  id uuid default uuid_generate_v4() primary key,
  topic text not null,
  category text not null check (category in ('Bureaucracy', 'Housing', 'Banking', 'Tax', 'Healthcare', 'Insurance', 'Visa')),
  focus_keywords text default '' not null,
  priority integer default 100 not null,
  status text default 'queued' not null check (status in ('queued', 'processing', 'generated', 'published', 'failed')),
  used boolean default false not null,
  attempts integer default 0 not null,
  locked_at timestamp with time zone,
  generated_at timestamp with time zone,
  generated_slug text,
  contentful_entry_id text,
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (topic)
);

-- -----------------------------------------------------------------------------
-- 7. Documents (User uploaded files)
-- -----------------------------------------------------------------------------
create table if not exists public.documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  document_name text not null,
  file_url text not null,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------
-- Enable Row Level Security (RLS)
-- Safe to run multiple times
-- -----------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.user_profiles enable row level security;
alter table public.user_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.user_tasks enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.user_checklist_state enable row level security;
alter table public.user_document_checklist enable row level security;
alter table public.reminder_email_events enable row level security;
alter table public.conversion_events enable row level security;
alter table public.blog_topic_queue enable row level security;
alter table public.documents enable row level security;

-- -----------------------------------------------------------------------------
-- Drop Existing Policies
-- This ensures idempotency by clearing old policies before recreating them.
-- -----------------------------------------------------------------------------

-- Users
drop policy if exists "Users can view their own data" on public.users;
drop policy if exists "Users can update their own data" on public.users;
drop policy if exists "Users can insert their own data" on public.users;

-- User Profiles
drop policy if exists "Users can view their own profiles" on public.user_profiles;
drop policy if exists "Users can update their own profiles" on public.user_profiles;
drop policy if exists "Users can insert their own profiles" on public.user_profiles;

-- User Plans
drop policy if exists "Users can view their own plans" on public.user_plans;
drop policy if exists "Users can update their own plans" on public.user_plans;
drop policy if exists "Users can insert their own plans" on public.user_plans;

-- Subscriptions
drop policy if exists "Users can view their own subscriptions" on public.subscriptions;

-- Payments
drop policy if exists "Users can view their own payments" on public.payments;

-- User Tasks
drop policy if exists "Users can view their own tasks" on public.user_tasks;
drop policy if exists "Users can update their own tasks" on public.user_tasks;
drop policy if exists "Users can insert their own tasks" on public.user_tasks;

-- User Checklist State
drop policy if exists "Users can view own notification preferences" on public.notification_preferences;
drop policy if exists "Users can insert own notification preferences" on public.notification_preferences;
drop policy if exists "Users can update own notification preferences" on public.notification_preferences;
drop policy if exists "Users can view own checklist state" on public.user_checklist_state;
drop policy if exists "Users can insert own checklist state" on public.user_checklist_state;
drop policy if exists "Users can update own checklist state" on public.user_checklist_state;
drop policy if exists "Users can delete own checklist state" on public.user_checklist_state;
drop policy if exists "Users can view own document checklist" on public.user_document_checklist;
drop policy if exists "Users can insert own document checklist" on public.user_document_checklist;
drop policy if exists "Users can update own document checklist" on public.user_document_checklist;
drop policy if exists "Users can delete own document checklist" on public.user_document_checklist;
drop policy if exists "Users can view own reminder email events" on public.reminder_email_events;
drop policy if exists "Service role manages reminder email events" on public.reminder_email_events;
drop policy if exists "Clients can insert consented conversion events" on public.conversion_events;
drop policy if exists "Service role can view conversion events" on public.conversion_events;
drop policy if exists "Service role manages blog topic queue" on public.blog_topic_queue;

-- Documents
drop policy if exists "Users can view their own documents" on public.documents;
drop policy if exists "Users can upload their own documents" on public.documents;
drop policy if exists "Users can delete their own documents" on public.documents;

-- -----------------------------------------------------------------------------
-- Create Policies
-- -----------------------------------------------------------------------------

-- 1. Users Policies
-- Users can only see/edit their own public user record
create policy "Users can view their own data" 
  on public.users for select 
  using (auth.uid() = id);

create policy "Users can update their own data" 
  on public.users for update 
  using (auth.uid() = id);

create policy "Users can insert their own data" 
  on public.users for insert 
  with check (auth.uid() = id);

-- 2. User Profiles Policies
-- Users can only see/edit their own profile details
create policy "Users can view their own profiles" 
  on public.user_profiles for select 
  using (auth.uid() = user_id);

create policy "Users can update their own profiles" 
  on public.user_profiles for update 
  using (auth.uid() = user_id);

create policy "Users can insert their own profiles" 
  on public.user_profiles for insert 
  with check (auth.uid() = user_id);

-- 3. User Plans Policies
-- Users can only see/edit their own relocation plans
create policy "Users can view their own plans" 
  on public.user_plans for select 
  using (auth.uid() = user_id);

create policy "Users can update their own plans" 
  on public.user_plans for update 
  using (auth.uid() = user_id);

create policy "Users can insert their own plans" 
  on public.user_plans for insert 
  with check (auth.uid() = user_id);

-- 4. Subscriptions Policies
-- Users can only view their own subscription status (updates handled by backend/webhooks generally)
create policy "Users can view their own subscriptions" 
  on public.subscriptions for select 
  using (auth.uid() = user_id);

-- 5. Payments Policies
-- Users can only view their own payment history
create policy "Users can view their own payments" 
  on public.payments for select 
  using (auth.uid() = user_id);

-- 6. User Tasks Policies
-- Users can only see/edit their own tasks
create policy "Users can view their own tasks" 
  on public.user_tasks for select 
  using (auth.uid() = user_id);

create policy "Users can update their own tasks" 
  on public.user_tasks for update 
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks" 
  on public.user_tasks for insert 
  with check (auth.uid() = user_id);

-- 6a. User Checklist State Policies
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

create policy "Users can view own reminder email events"
  on public.reminder_email_events for select
  using (auth.uid() = user_id);

create policy "Service role manages reminder email events"
  on public.reminder_email_events for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Clients can insert consented conversion events"
  on public.conversion_events for insert
  with check (user_id is null or auth.uid() = user_id);

create policy "Service role can view conversion events"
  on public.conversion_events for select
  using (auth.role() = 'service_role');

create policy "Service role manages blog topic queue"
  on public.blog_topic_queue for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- 7. Documents Policies
-- Users can only see/edit their own documents
create policy "Users can view their own documents" 
  on public.documents for select 
  using (auth.uid() = user_id);

create policy "Users can upload their own documents" 
  on public.documents for insert 
  with check (auth.uid() = user_id);

create policy "Users can delete their own documents" 
  on public.documents for delete 
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Create Indexes
-- Improving performance for queries filtering by user_id
-- -----------------------------------------------------------------------------
create index if not exists idx_user_profiles_user_id on public.user_profiles(user_id);
create index if not exists idx_user_plans_user_id on public.user_plans(user_id);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_user_tasks_user_id on public.user_tasks(user_id);
create index if not exists idx_notification_preferences_user_id on public.notification_preferences(user_id);
create index if not exists idx_user_checklist_state_user_id on public.user_checklist_state(user_id);
create index if not exists idx_user_checklist_state_lookup on public.user_checklist_state(user_id, checklist_key);
create index if not exists idx_user_document_checklist_user_id on public.user_document_checklist(user_id);
create index if not exists idx_user_document_checklist_lookup on public.user_document_checklist(user_id, document_id);
create index if not exists idx_reminder_email_events_due on public.reminder_email_events(status, scheduled_for);
create index if not exists idx_reminder_email_events_user on public.reminder_email_events(user_id, created_at desc);
drop index if exists public.idx_reminder_email_events_once_per_day;
create unique index if not exists idx_reminder_email_events_once_per_subject
  on public.reminder_email_events(user_id, reminder_type, subject)
  where status in ('queued', 'sent');
create index if not exists idx_conversion_events_name_created on public.conversion_events(event_name, created_at desc);
create index if not exists idx_conversion_events_visitor_created on public.conversion_events(visitor_id, created_at desc);
create index if not exists idx_conversion_events_user_created on public.conversion_events(user_id, created_at desc);
create index if not exists idx_blog_topic_queue_next on public.blog_topic_queue(used, status, attempts, priority, created_at);
create index if not exists idx_blog_topic_queue_generated_at on public.blog_topic_queue(generated_at desc) where generated_at is not null;
create index if not exists idx_documents_user_id on public.documents(user_id);

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

-- -----------------------------------------------------------------------------
-- Instructions
-- 1. Copy this entire script.
-- 2. Go to the Supabase Dashboard -> SQL Editor.
-- 3. Paste the script and run it.
-- -----------------------------------------------------------------------------
