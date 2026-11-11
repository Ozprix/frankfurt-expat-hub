-- Legacy migrations granted these RPCs directly to anon. Remove those explicit
-- grants; authenticated callers retain only the narrowly authorised functions.
revoke all on function public.check_achievements(uuid) from anon;
revoke all on function public.disconnect_calendar(uuid, text) from anon;
revoke all on function public.get_calendar_integrations(uuid) from anon;
revoke all on function public.get_dashboard_overview(uuid) from anon;
revoke all on function public.get_monthly_usage(uuid) from anon;
revoke all on function public.get_user_stats(uuid) from anon;
revoke all on function public.get_user_subscription(uuid) from anon;
revoke all on function public.increment_post_views(uuid) from anon;
revoke all on function public.log_user_activity(uuid, text, text, jsonb) from anon;
revoke all on function public.sync_task_to_calendar(uuid, text, text) from anon;
revoke all on function public.update_plan_progress(uuid) from anon;
revoke all on function public.update_user_last_login(uuid) from anon;
revoke all on function public.update_user_streak(uuid) from anon;
