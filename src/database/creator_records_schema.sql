-- Creator Records: run in the Supabase SQL editor before enabling production sync.
create table if not exists public.creator_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tax_year integer not null default extract(year from now()),
  platforms text[] not null default '{}',
  business_status text,
  vat_status text,
  has_advisor boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.creator_records (
  id text primary key, user_id uuid not null references auth.users(id) on delete cascade,
  tax_year integer not null, record_type text not null check (record_type in ('income','sample','expense')),
  title text not null, source text, received_date date, displayed_value numeric(12,2), paid_amount numeric(12,2),
  category text, disposition text not null default 'Unknown', import_key text,
  business_use text not null default 'Unknown' check (business_use in ('Unknown','No','Mixed','Yes')),
  business_use_percent numeric(5,2), treatment_candidate text,
  content_url text, linked_sample_id text references public.creator_records(id) on delete set null,
  notes text not null default '',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.creator_evidence (
  id uuid primary key, user_id uuid not null references auth.users(id) on delete cascade,
  creator_record_id text not null references public.creator_records(id) on delete cascade,
  file_name text not null, file_type text, file_size bigint, storage_path text not null, uploaded_at timestamptz not null default now()
);
create unique index if not exists creator_records_user_import_key on public.creator_records (user_id, import_key) where import_key is not null;
alter table public.creator_profiles enable row level security;
alter table public.creator_records enable row level security;
alter table public.creator_evidence enable row level security;
grant select, insert, update, delete on public.creator_profiles, public.creator_records, public.creator_evidence to authenticated;
create policy "creator profiles belong to user" on public.creator_profiles for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "creator records belong to user" on public.creator_records for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "creator evidence belongs to user" on public.creator_evidence for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
insert into storage.buckets (id, name, public) values ('creator-evidence', 'creator-evidence', false) on conflict (id) do nothing;
create policy "creator evidence upload" on storage.objects for insert to authenticated with check (bucket_id = 'creator-evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "creator evidence read" on storage.objects for select to authenticated using (bucket_id = 'creator-evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "creator evidence delete" on storage.objects for delete to authenticated using (bucket_id = 'creator-evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);
