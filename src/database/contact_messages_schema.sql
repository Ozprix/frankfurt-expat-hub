-- Contact form persistence for Supabase Edge Function `contact-form`

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) <= 120),
  email text not null check (char_length(email) <= 255),
  subject text not null check (char_length(subject) <= 160),
  message text not null check (char_length(message) <= 5000),
  source text not null default 'contact-page' check (char_length(source) <= 80),
  user_id uuid references auth.users(id) on delete set null,
  ip_address inet,
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

create index if not exists idx_contact_messages_created_at on public.contact_messages (created_at desc);
create index if not exists idx_contact_messages_email on public.contact_messages (email);
create index if not exists idx_contact_messages_ip_created on public.contact_messages (ip_address, created_at desc);

alter table public.contact_messages enable row level security;

-- No direct access from anon/authenticated clients. Writes are performed by service-role Edge Function.
revoke all on table public.contact_messages from anon;
revoke all on table public.contact_messages from authenticated;
