-- Curated Jobs operations. Public pages never query this table directly;
-- submissions are created through the validated contact-form Edge Function.
create table if not exists public.job_leads (
  id uuid primary key default gen_random_uuid(),
  contact_message_id bigint references public.contact_messages(id) on delete set null,
  lead_type text not null check (lead_type in ('job_alert', 'employer_submission')),
  employer_name text check (char_length(employer_name) <= 160),
  role_area text check (char_length(role_area) <= 120),
  requester_name text not null check (char_length(requester_name) <= 120),
  requester_email text not null check (char_length(requester_email) <= 255),
  details text check (char_length(details) <= 5000),
  status text not null default 'new' check (status in ('new', 'reviewing', 'approved', 'published', 'closed')),
  staff_notes text check (char_length(staff_notes) <= 5000),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_job_leads_status_created on public.job_leads (status, created_at desc);
create index if not exists idx_job_leads_type_created on public.job_leads (lead_type, created_at desc);

alter table public.job_leads enable row level security;
revoke all on table public.job_leads from anon, authenticated;
