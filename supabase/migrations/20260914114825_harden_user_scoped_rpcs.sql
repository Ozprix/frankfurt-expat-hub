-- Harden legacy public RPCs. Every user-scoped function now verifies the caller
-- owns the requested user/plan before operating. The functions use a pinned,
-- empty search path and explicit schema qualification to prevent object shadowing.

create or replace function public.check_achievements(user_id_input uuid)
returns table(achievement_id text, title text, description text, icon text, unlocked_at timestamptz)
language plpgsql security definer set search_path = '' as $$
declare v_plan_count integer; v_task_count integer; v_streak_count integer; v_longest_streak integer;
begin
  if (select auth.uid()) is distinct from user_id_input then raise exception 'Forbidden' using errcode = '42501'; end if;
  select count(*) into v_plan_count from public.user_plans where user_id = user_id_input;
  select count(*) into v_task_count from public.user_tasks where user_id = user_id_input and status = 'completed';
  select current_streak, longest_streak into v_streak_count, v_longest_streak from public.user_streaks where user_id = user_id_input;
  v_streak_count := coalesce(v_streak_count, 0); v_longest_streak := coalesce(v_longest_streak, 0);
  if v_plan_count >= 1 then insert into public.user_achievements (user_id, achievement_id, title, description, icon) values (user_id_input, 'first_plan', 'Planner', 'Created your first relocation plan', 'Map') on conflict do nothing; end if;
  if v_task_count >= 10 then insert into public.user_achievements (user_id, achievement_id, title, description, icon) values (user_id_input, 'task_master', 'Task Master', 'Completed 10 tasks', 'CheckSquare') on conflict do nothing; end if;
  if v_streak_count >= 7 then insert into public.user_achievements (user_id, achievement_id, title, description, icon) values (user_id_input, 'week_warrior', 'Week Warrior', 'Maintained a 7-day streak', 'Flame') on conflict do nothing; end if;
  if v_longest_streak >= 30 then insert into public.user_achievements (user_id, achievement_id, title, description, icon) values (user_id_input, 'month_marathon', 'Month Marathon', 'Reached a 30-day streak', 'Award') on conflict do nothing; end if;
  return query select ua.achievement_id, ua.title, ua.description, ua.icon, ua.unlocked_at from public.user_achievements ua where ua.user_id = user_id_input;
end; $$;

create or replace function public.disconnect_calendar(user_id_input uuid, provider_input text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is distinct from user_id_input then raise exception 'Forbidden' using errcode = '42501'; end if;
  delete from public.calendar_syncs where user_id = user_id_input and provider = provider_input;
  delete from public.calendar_integrations where user_id = user_id_input and provider = provider_input;
  return true;
end; $$;

create or replace function public.get_calendar_integrations(user_id_input uuid)
returns table(id uuid, user_id uuid, provider text, calendar_id text, is_active boolean, synced_at timestamptz, created_at timestamptz)
language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is distinct from user_id_input then raise exception 'Forbidden' using errcode = '42501'; end if;
  return query select ci.id, ci.user_id, ci.provider, ci.calendar_id, ci.is_active, ci.synced_at, ci.created_at from public.calendar_integrations ci where ci.user_id = user_id_input order by ci.created_at desc;
end; $$;

create or replace function public.get_monthly_usage(target_user_id uuid)
returns table(feature_name text, usage_count bigint, last_used timestamptz)
language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is distinct from target_user_id then raise exception 'Forbidden' using errcode = '42501'; end if;
  return query select ul.feature_name, count(*)::bigint, max(ul.created_at) from public.usage_logs ul where ul.user_id = target_user_id and ul.created_at > (now() - interval '30 days') group by ul.feature_name;
end; $$;

create or replace function public.get_user_stats(user_id_input uuid)
returns table(total_budgets bigint, total_forum_posts bigint, total_forum_replies bigint, total_apartments_saved bigint, total_videos_watched bigint, last_login timestamptz, total_plans bigint, completed_tasks bigint, current_streak integer, longest_streak integer)
language plpgsql security definer set search_path = '' as $$
declare v_last_login timestamptz; v_user_current_streak integer; v_user_longest_streak integer;
begin
  if (select auth.uid()) is distinct from user_id_input then raise exception 'Forbidden' using errcode = '42501'; end if;
  select us.last_login into v_last_login from public.user_stats us where us.user_id = user_id_input;
  select streaks.current_streak, streaks.longest_streak into v_user_current_streak, v_user_longest_streak from public.user_streaks streaks where streaks.user_id = user_id_input;
  return query select
    (select count(*) from public.user_budgets where user_id = user_id_input)::bigint,
    (select count(*) from public.forum_posts where user_id = user_id_input)::bigint,
    (select count(*) from public.forum_replies where user_id = user_id_input)::bigint,
    (select count(*) from public.saved_apartments where user_id = user_id_input)::bigint,
    (select count(*) from public.video_progress where user_id = user_id_input and completed = true)::bigint,
    coalesce(v_last_login, now()),
    (select count(*) from public.user_plans where user_id = user_id_input)::bigint,
    (select count(*) from public.user_tasks where user_id = user_id_input and status = 'completed')::bigint,
    coalesce(v_user_current_streak, 0), coalesce(v_user_longest_streak, 0);
end; $$;

create or replace function public.get_user_subscription(target_user_id uuid)
returns table(id uuid, user_id uuid, tier text, status text, billing_period text, renewal_price integer, current_period_end timestamptz, cancel_at_period_end boolean)
language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is distinct from target_user_id then raise exception 'Forbidden' using errcode = '42501'; end if;
  return query select s.id, s.user_id, s.tier, s.status, s.billing_period, s.renewal_price, s.current_period_end, s.cancel_at_period_end from public.subscriptions s where s.user_id = target_user_id order by s.created_at desc limit 1;
end; $$;

create or replace function public.get_dashboard_overview(target_user_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_stats record; v_result jsonb;
begin
  if (select auth.uid()) is distinct from target_user_id then raise exception 'Forbidden' using errcode = '42501'; end if;
  select * into v_stats from public.get_user_stats(target_user_id);
  v_result := jsonb_build_object('stats', jsonb_build_object('total_budgets', v_stats.total_budgets, 'total_forum_posts', v_stats.total_forum_posts, 'total_apartments_saved', v_stats.total_apartments_saved, 'total_videos_watched', v_stats.total_videos_watched, 'last_login', v_stats.last_login, 'completed_tasks', v_stats.completed_tasks), 'subscription', coalesce((select jsonb_build_object('tier', sub.tier, 'status', sub.status, 'current_period_end', sub.current_period_end) from public.get_user_subscription(target_user_id) sub limit 1), jsonb_build_object('tier', null, 'status', null, 'current_period_end', null)));
  return v_result;
end; $$;

create or replace function public.log_user_activity(target_user_id uuid, feature_name text, action text, metadata jsonb default '{}'::jsonb)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is distinct from target_user_id then raise exception 'Forbidden' using errcode = '42501'; end if;
  insert into public.usage_logs (user_id, feature_name, action, metadata) values (target_user_id, feature_name, action, metadata);
end; $$;

create or replace function public.sync_task_to_calendar(user_id_input uuid, task_id_input text, provider_input text)
returns table(id uuid, user_id uuid, task_id text, calendar_event_id text, provider text, synced_at timestamptz)
language plpgsql security definer set search_path = '' as $$
declare v_event_id text; v_sync_id uuid;
begin
  if (select auth.uid()) is distinct from user_id_input then raise exception 'Forbidden' using errcode = '42501'; end if;
  v_event_id := 'evt_' || replace(extensions.uuid_generate_v4()::text, '-', '');
  insert into public.calendar_syncs (user_id, task_id, calendar_event_id, provider, synced_at) values (user_id_input, task_id_input, v_event_id, provider_input, now()) on conflict (user_id, task_id, provider) do update set synced_at = now(), calendar_event_id = v_event_id returning calendar_syncs.id into v_sync_id;
  return query select cs.id, cs.user_id, cs.task_id, cs.calendar_event_id, cs.provider, cs.synced_at from public.calendar_syncs cs where cs.id = v_sync_id;
end; $$;

create or replace function public.update_plan_progress(plan_id_input uuid)
returns table(id uuid, plan_id uuid, user_id uuid, total_tasks integer, completed_tasks integer, completion_percentage integer, last_updated timestamptz)
language plpgsql security definer set search_path = '' as $$
declare v_user_id uuid; v_total integer; v_completed integer; v_percentage integer; v_progress_id uuid;
begin
  select p.user_id into v_user_id from public.user_plans p where p.id = plan_id_input;
  if v_user_id is null or (select auth.uid()) is distinct from v_user_id then raise exception 'Forbidden' using errcode = '42501'; end if;
  select count(*), count(*) filter (where t.status = 'completed') into v_total, v_completed from public.user_tasks t where t.user_id = v_user_id and (t.plan_id = plan_id_input or t.plan_id is null);
  v_percentage := case when v_total > 0 then (v_completed::float / v_total::float * 100)::integer else 0 end;
  insert into public.plan_progress (plan_id, user_id, total_tasks, completed_tasks, completion_percentage, last_updated) values (plan_id_input, v_user_id, v_total, v_completed, v_percentage, now()) on conflict (plan_id) do update set total_tasks = excluded.total_tasks, completed_tasks = excluded.completed_tasks, completion_percentage = excluded.completion_percentage, last_updated = excluded.last_updated returning plan_progress.id into v_progress_id;
  return query select pp.id, pp.plan_id, pp.user_id, pp.total_tasks, pp.completed_tasks, pp.completion_percentage, pp.last_updated from public.plan_progress pp where pp.id = v_progress_id;
end; $$;

create or replace function public.update_user_last_login(target_user_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is distinct from target_user_id then raise exception 'Forbidden' using errcode = '42501'; end if;
  insert into public.user_stats (user_id, last_login, updated_at) values (target_user_id, now(), now()) on conflict (user_id) do update set last_login = now(), updated_at = now();
end; $$;

create or replace function public.update_user_streak(user_id_input uuid)
returns table(id uuid, user_id uuid, current_streak integer, longest_streak integer, last_activity_date date, created_at timestamptz)
language plpgsql security definer set search_path = '' as $$
declare v_streak_record public.user_streaks%rowtype; v_yesterday date := current_date - 1; v_today date := current_date; v_new_streak integer := 1; v_new_longest integer := 1;
begin
  if (select auth.uid()) is distinct from user_id_input then raise exception 'Forbidden' using errcode = '42501'; end if;
  select * into v_streak_record from public.user_streaks where user_streaks.user_id = user_id_input;
  if v_streak_record.id is null then insert into public.user_streaks (user_id, current_streak, longest_streak, last_activity_date) values (user_id_input, 1, 1, v_today) returning * into v_streak_record;
  else
    v_new_streak := case when v_streak_record.last_activity_date = v_yesterday then v_streak_record.current_streak + 1 when v_streak_record.last_activity_date = v_today then v_streak_record.current_streak else 1 end;
    v_new_longest := greatest(v_new_streak, v_streak_record.longest_streak);
    update public.user_streaks set current_streak = v_new_streak, longest_streak = v_new_longest, last_activity_date = v_today where user_streaks.user_id = user_id_input returning * into v_streak_record;
  end if;
  return query select v_streak_record.id, v_streak_record.user_id, v_streak_record.current_streak, v_streak_record.longest_streak, v_streak_record.last_activity_date, v_streak_record.created_at;
end; $$;

-- The achievement function writes user-owned rows and must obey the same ownership boundary.
-- Blog view tracking does not expose data; require sign-in until it is redesigned as a narrow public endpoint.
alter function public.increment_post_views(uuid) set search_path = '';

revoke all on function public.check_achievements(uuid) from public;
revoke all on function public.disconnect_calendar(uuid, text) from public;
revoke all on function public.get_calendar_integrations(uuid) from public;
revoke all on function public.get_dashboard_overview(uuid) from public;
revoke all on function public.get_monthly_usage(uuid) from public;
revoke all on function public.get_user_stats(uuid) from public;
revoke all on function public.get_user_subscription(uuid) from public;
revoke all on function public.increment_post_views(uuid) from public;
revoke all on function public.log_user_activity(uuid, text, text, jsonb) from public;
revoke all on function public.sync_task_to_calendar(uuid, text, text) from public;
revoke all on function public.update_plan_progress(uuid) from public;
revoke all on function public.update_user_last_login(uuid) from public;
revoke all on function public.update_user_streak(uuid) from public;

grant execute on function public.check_achievements(uuid) to authenticated;
grant execute on function public.disconnect_calendar(uuid, text) to authenticated;
grant execute on function public.get_calendar_integrations(uuid) to authenticated;
grant execute on function public.get_dashboard_overview(uuid) to authenticated;
grant execute on function public.get_monthly_usage(uuid) to authenticated;
grant execute on function public.get_user_stats(uuid) to authenticated;
grant execute on function public.get_user_subscription(uuid) to authenticated;
grant execute on function public.increment_post_views(uuid) to authenticated;
grant execute on function public.log_user_activity(uuid, text, text, jsonb) to authenticated;
grant execute on function public.sync_task_to_calendar(uuid, text, text) to authenticated;
grant execute on function public.update_plan_progress(uuid) to authenticated;
grant execute on function public.update_user_last_login(uuid) to authenticated;
grant execute on function public.update_user_streak(uuid) to authenticated;
