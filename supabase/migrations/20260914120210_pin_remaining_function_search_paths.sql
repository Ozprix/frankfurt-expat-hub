-- Make function name resolution deterministic for the remaining invoker and
-- trigger functions reported by the Supabase security advisor.
-- These functions deliberately retain their existing execute permissions.

ALTER FUNCTION public.forum_moderation_status(text, text) SET search_path = '';
ALTER FUNCTION public.get_health_check_dummy_function() SET search_path = '';
ALTER FUNCTION public.set_forum_post_moderation() SET search_path = '';
ALTER FUNCTION public.set_forum_reply_moderation() SET search_path = '';
ALTER FUNCTION public.set_updated_at() SET search_path = '';
