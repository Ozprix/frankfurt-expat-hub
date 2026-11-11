-- Directory marketplace operations.
-- The browser never reads or writes these tables. The contact-form Edge Function
-- uses the service role to create records after validation and rate limiting.

create table if not exists public.directory_providers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  business_name text not null check (char_length(business_name) <= 160),
  category text not null check (char_length(category) <= 100),
  location text check (char_length(location) <= 180),
  service_area text check (char_length(service_area) <= 180),
  languages text[] not null default '{}',
  services text[] not null default '{}',
  summary text check (char_length(summary) <= 1000),
  website_url text,
  pricing_model text check (char_length(pricing_model) <= 240),
  verification_status text not null default 'pending' check (verification_status in ('pending', 'verified', 'expired', 'declined')),
  verification_checked_at timestamptz,
  verification_notes text check (char_length(verification_notes) <= 4000),
  placement_type text not null default 'editorial' check (placement_type in ('editorial', 'featured', 'sponsored')),
  is_public boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.directory_leads (
  id uuid primary key default gen_random_uuid(),
  contact_message_id bigint references public.contact_messages(id) on delete set null,
  lead_type text not null check (lead_type in ('introduction_request', 'provider_application')),
  provider_name text check (char_length(provider_name) <= 160),
  provider_category text check (char_length(provider_category) <= 100),
  requester_name text not null check (char_length(requester_name) <= 120),
  requester_email text not null check (char_length(requester_email) <= 255),
  enquiry_summary text check (char_length(enquiry_summary) <= 5000),
  status text not null default 'new' check (status in ('new', 'reviewing', 'introduced', 'provider_accepted', 'booked', 'qualified', 'closed')),
  staff_notes text check (char_length(staff_notes) <= 5000),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_directory_providers_public_category
  on public.directory_providers (is_public, category, verification_status);
create index if not exists idx_directory_leads_status_created
  on public.directory_leads (status, created_at desc);
create index if not exists idx_directory_leads_type_created
  on public.directory_leads (lead_type, created_at desc);

alter table public.directory_providers enable row level security;
alter table public.directory_leads enable row level security;

revoke all on table public.directory_providers from anon, authenticated;
revoke all on table public.directory_leads from anon, authenticated;
