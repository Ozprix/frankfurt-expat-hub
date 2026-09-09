-- Blog automation queue for Supabase Edge Function `generate-blog-post`.
-- Apply with service/admin privileges. Runtime access is service-role only.

create extension if not exists "uuid-ossp";

create table if not exists public.blog_topic_queue (
  id uuid default uuid_generate_v4() primary key,
  topic text not null,
  category text not null check (category in (
    'Bureaucracy',
    'Housing',
    'Banking',
    'Tax',
    'Healthcare',
    'Insurance',
    'Visa'
  )),
  focus_keywords text default '' not null,
  priority integer default 100 not null,
  status text default 'queued' not null check (status in (
    'queued',
    'processing',
    'generated',
    'published',
    'failed'
  )),
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

alter table public.blog_topic_queue enable row level security;

drop policy if exists "Service role manages blog topic queue" on public.blog_topic_queue;
create policy "Service role manages blog topic queue"
  on public.blog_topic_queue for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create index if not exists idx_blog_topic_queue_next
  on public.blog_topic_queue(used, status, attempts, priority, created_at);

create index if not exists idx_blog_topic_queue_generated_at
  on public.blog_topic_queue(generated_at desc)
  where generated_at is not null;

insert into public.blog_topic_queue (topic, category, focus_keywords, priority)
values
  ('Tax prep documents checklist for Frankfurt employees', 'Tax', 'tax prep documents Frankfurt expats Steuererklärung', 10),
  ('What to ask an English-speaking tax advisor in Frankfurt', 'Tax', 'English speaking tax advisor Frankfurt expats', 20),
  ('Anmeldung documents checklist for temporary housing in Frankfurt', 'Bureaucracy', 'Anmeldung temporary housing Frankfurt documents', 30),
  ('Health insurance documents to keep for your German tax return', 'Healthcare', 'health insurance tax return Germany expats', 40),
  ('Frankfurt renter packet checklist for newcomers without Schufa', 'Housing', 'Frankfurt renter packet newcomers Schufa alternatives', 50),
  ('German tax ID follow-up steps after Anmeldung in Frankfurt', 'Bureaucracy', 'tax ID after Anmeldung Frankfurt', 60),
  ('Freelancer expense records expats should keep in Germany', 'Tax', 'freelancer expenses Germany expats tax records', 70)
on conflict (topic) do nothing;
