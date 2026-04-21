
-- Dashboard Migration File

-- 1. Ensure subscriptions table exists (if not already)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    stripe_customer_id text,
    stripe_subscription_id text,
    tier text,
    status text,
    billing_period text,
    renewal_price integer DEFAULT 0,
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    cancel_at_period_end boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS billing_period text,
ADD COLUMN IF NOT EXISTS renewal_price integer DEFAULT 0;

-- RLS for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" 
ON public.subscriptions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" 
ON public.subscriptions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 2. Create user_stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id),
    total_budgets integer DEFAULT 0,
    total_forum_posts integer DEFAULT 0,
    total_forum_replies integer DEFAULT 0,
    total_apartments_saved integer DEFAULT 0,
    total_videos_watched integer DEFAULT 0,
    last_login timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats" 
ON public.user_stats FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" 
ON public.user_stats FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" 
ON public.user_stats FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Create usage_logs table
CREATE TABLE IF NOT EXISTS public.usage_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    feature_name text NOT NULL,
    action text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert usage logs" 
ON public.usage_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own usage logs" 
ON public.usage_logs FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id
ON public.subscriptions(stripe_subscription_id)
WHERE stripe_subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);

-- 5. Functions

-- Update user last login
CREATE OR REPLACE FUNCTION public.update_user_last_login(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_stats (user_id, last_login, updated_at)
  VALUES (target_user_id, now(), now())
  ON CONFLICT (user_id) 
  DO UPDATE SET last_login = now(), updated_at = now();
END;
$$;

-- Log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(target_user_id uuid, feature_name text, action text, metadata jsonb DEFAULT '{}'::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.usage_logs (user_id, feature_name, action, metadata)
  VALUES (target_user_id, feature_name, action, metadata);
END;
$$;

-- Get User Subscription (Specific)
CREATE OR REPLACE FUNCTION public.get_user_subscription(target_user_id uuid)
RETURNS TABLE(
    id uuid,
    user_id uuid,
    tier text,
    status text,
    billing_period text,
    renewal_price integer,
    current_period_end timestamp with time zone,
    cancel_at_period_end boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    s.tier,
    s.status,
    s.billing_period,
    s.renewal_price,
    s.current_period_end,
    s.cancel_at_period_end
  FROM public.subscriptions s
  WHERE s.user_id = target_user_id
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$;

-- Get Monthly Usage
CREATE OR REPLACE FUNCTION public.get_monthly_usage(target_user_id uuid)
RETURNS TABLE(
    feature_name text,
    usage_count bigint,
    last_used timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ul.feature_name,
    COUNT(*)::bigint as usage_count,
    MAX(ul.created_at) as last_used
  FROM public.usage_logs ul
  WHERE ul.user_id = target_user_id
    AND ul.created_at > (now() - interval '30 days')
  GROUP BY ul.feature_name;
END;
$$;

-- Get User Stats (Comprehensive)
-- Note: This aggregates real-time counts to ensure accuracy
CREATE OR REPLACE FUNCTION public.get_user_stats(user_id_input uuid)
RETURNS TABLE(
    total_budgets bigint,
    total_forum_posts bigint,
    total_forum_replies bigint,
    total_apartments_saved bigint,
    total_videos_watched bigint,
    last_login timestamp with time zone,
    -- Keeping original columns to avoid breaking other hooks
    total_plans bigint,
    completed_tasks bigint,
    current_streak integer,
    longest_streak integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_last_login timestamp with time zone;
    v_current_streak integer;
    v_longest_streak integer;
BEGIN
    -- Get simple scalar values first
    SELECT us.last_login INTO v_last_login FROM public.user_stats us WHERE us.user_id = user_id_input;
    SELECT current_streak, longest_streak INTO v_current_streak, v_longest_streak FROM public.user_streaks WHERE user_id = user_id_input;

    RETURN QUERY
    SELECT
        (SELECT count(*) FROM public.user_budgets WHERE user_id = user_id_input)::bigint as total_budgets,
        (SELECT count(*) FROM public.forum_posts WHERE user_id = user_id_input)::bigint as total_forum_posts,
        (SELECT count(*) FROM public.forum_replies WHERE user_id = user_id_input)::bigint as total_forum_replies,
        (SELECT count(*) FROM public.saved_apartments WHERE user_id = user_id_input)::bigint as total_apartments_saved,
        (SELECT count(*) FROM public.video_progress WHERE user_id = user_id_input AND completed = true)::bigint as total_videos_watched,
        COALESCE(v_last_login, now()) as last_login,
        (SELECT count(*) FROM public.user_plans WHERE user_id = user_id_input)::bigint as total_plans,
        (SELECT count(*) FROM public.user_tasks WHERE user_id = user_id_input AND status = 'completed')::bigint as completed_tasks,
        COALESCE(v_current_streak, 0) as current_streak,
        COALESCE(v_longest_streak, 0) as longest_streak;
END;
$$;

-- Get Dashboard Overview
CREATE OR REPLACE FUNCTION public.get_dashboard_overview(target_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_stats record;
    v_sub record;
    v_result jsonb;
BEGIN
    -- Fetch stats
    SELECT * INTO v_stats FROM public.get_user_stats(target_user_id);
    
    -- Fetch subscription
    SELECT * INTO v_sub FROM public.get_user_subscription(target_user_id);
    
    v_result := jsonb_build_object(
        'stats', jsonb_build_object(
            'total_budgets', v_stats.total_budgets,
            'total_forum_posts', v_stats.total_forum_posts,
            'total_apartments_saved', v_stats.total_apartments_saved,
            'total_videos_watched', v_stats.total_videos_watched,
            'last_login', v_stats.last_login,
            'completed_tasks', v_stats.completed_tasks
        ),
        'subscription', jsonb_build_object(
            'tier', v_sub.tier,
            'status', v_sub.status,
            'current_period_end', v_sub.current_period_end
        )
    );
    
    RETURN v_result;
END;
$$;
