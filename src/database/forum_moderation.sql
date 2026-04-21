-- Basic server-side forum moderation controls.
-- New posts remain public-read only when approved; suspicious posts are held.

alter table public.forum_posts
  add column if not exists moderation_status text default 'approved' not null,
  add column if not exists moderation_reason text,
  add column if not exists reviewed_at timestamp with time zone;

alter table public.forum_replies
  add column if not exists moderation_status text default 'approved' not null,
  add column if not exists moderation_reason text,
  add column if not exists reviewed_at timestamp with time zone;

create or replace function public.forum_moderation_status(content text, title text default '')
returns table(status text, reason text)
language plpgsql
immutable
as $$
declare
  combined text := coalesce(title, '') || ' ' || coalesce(content, '');
  link_count integer := regexp_count(combined, '(https?://|www\.)', 1, 'i');
begin
  if length(trim(coalesce(content, ''))) < 40 then
    return query select 'pending'::text, 'Very short post or reply'::text;
  elsif link_count > 2 then
    return query select 'pending'::text, 'Too many links'::text;
  elsif combined ~* '\m(casino|crypto profit|crypto guarantee|forex signal|loan offer)\M' then
    return query select 'pending'::text, 'Promotional or spam-like wording'::text;
  elsif combined ~* 'whatsapp\s*\+?\d{6,}' then
    return query select 'pending'::text, 'Direct messaging spam pattern'::text;
  end if;

  return query select 'approved'::text, null::text;
end;
$$;

create or replace function public.set_forum_post_moderation()
returns trigger
language plpgsql
as $$
declare
  moderation record;
begin
  select * into moderation from public.forum_moderation_status(new.content, new.title);
  new.moderation_status = moderation.status;
  new.moderation_reason = moderation.reason;
  return new;
end;
$$;

create or replace function public.set_forum_reply_moderation()
returns trigger
language plpgsql
as $$
declare
  moderation record;
begin
  select * into moderation from public.forum_moderation_status(new.content);
  new.moderation_status = moderation.status;
  new.moderation_reason = moderation.reason;
  return new;
end;
$$;

drop trigger if exists trg_set_forum_post_moderation on public.forum_posts;
create trigger trg_set_forum_post_moderation
  before insert or update of title, content on public.forum_posts
  for each row execute function public.set_forum_post_moderation();

drop trigger if exists trg_set_forum_reply_moderation on public.forum_replies;
create trigger trg_set_forum_reply_moderation
  before insert or update of content on public.forum_replies
  for each row execute function public.set_forum_reply_moderation();

drop policy if exists "Public can view forum posts" on public.forum_posts;
create policy "Public can view forum posts"
  on public.forum_posts for select
  using (moderation_status = 'approved' or auth.uid() = user_id);

drop policy if exists "Public can view forum replies" on public.forum_replies;
create policy "Public can view forum replies"
  on public.forum_replies for select
  using (moderation_status = 'approved' or auth.uid() = user_id);

create index if not exists idx_forum_posts_moderation_status
  on public.forum_posts(moderation_status, created_at desc);

create index if not exists idx_forum_replies_moderation_status
  on public.forum_replies(moderation_status, created_at desc);
