
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

DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can update own subscriptions" 
ON public.subscriptions FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
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

DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;
CREATE POLICY "Users can view own stats" 
ON public.user_stats FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;
CREATE POLICY "Users can update own stats" 
ON public.user_stats FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
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

DROP POLICY IF EXISTS "Users can insert usage logs" ON public.usage_logs;
CREATE POLICY "Users can insert usage logs" 
ON public.usage_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own usage logs" ON public.usage_logs;
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

-- 4b. Progress and achievements support
CREATE TABLE IF NOT EXISTS public.user_streaks (
    user_id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak integer DEFAULT 0 NOT NULL,
    longest_streak integer DEFAULT 0 NOT NULL,
    last_activity_date date,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own streaks" ON public.user_streaks;
CREATE POLICY "Users can view own streaks"
ON public.user_streaks FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own streaks" ON public.user_streaks;
CREATE POLICY "Users can insert own streaks"
ON public.user_streaks FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own streaks" ON public.user_streaks;
CREATE POLICY "Users can update own streaks"
ON public.user_streaks FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    achievement_key text NOT NULL UNIQUE,
    title text NOT NULL,
    description text NOT NULL,
    icon text DEFAULT '🏆' NOT NULL,
    condition_type text NOT NULL,
    threshold integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view achievements" ON public.achievements;
CREATE POLICY "Authenticated users can view achievements"
ON public.achievements FOR SELECT
USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own achievement unlocks" ON public.user_achievements;
CREATE POLICY "Users can view own achievement unlocks"
ON public.user_achievements FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own achievement unlocks" ON public.user_achievements;
CREATE POLICY "Users can insert own achievement unlocks"
ON public.user_achievements FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON public.user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_condition ON public.achievements(condition_type, threshold);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id, unlocked_at DESC);

INSERT INTO public.achievements (achievement_key, title, description, icon, condition_type, threshold)
VALUES
    ('first_budget', 'Budget Builder', 'Create your first budget scenario.', '💶', 'total_budgets', 1),
    ('two_budgets', 'Scenario Planner', 'Create at least two budget scenarios.', '📊', 'total_budgets', 2),
    ('first_task', 'Getting Started', 'Complete your first relocation task.', '✅', 'completed_tasks', 1),
    ('five_tasks', 'Momentum', 'Complete five relocation tasks.', '🚀', 'completed_tasks', 5),
    ('first_plan', 'Plan in Motion', 'Generate your first relocation plan.', '🗺️', 'total_plans', 1),
    ('streak_3', 'Three-Day Streak', 'Stay active for three days in a row.', '🔥', 'current_streak', 3),
    ('forum_first_post', 'Community Voice', 'Create your first forum post.', '💬', 'total_forum_posts', 1)
ON CONFLICT (achievement_key) DO UPDATE
SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    condition_type = EXCLUDED.condition_type,
    threshold = EXCLUDED.threshold;

-- 5. Functions

DROP FUNCTION IF EXISTS public.get_dashboard_overview(uuid);
DROP FUNCTION IF EXISTS public.get_user_stats(uuid);
DROP FUNCTION IF EXISTS public.get_monthly_usage(uuid);
DROP FUNCTION IF EXISTS public.get_user_subscription(uuid);
DROP FUNCTION IF EXISTS public.check_achievements(uuid);
DROP FUNCTION IF EXISTS public.increment_usage(uuid, text);
DROP FUNCTION IF EXISTS public.touch_user_streak(uuid, date);

CREATE OR REPLACE FUNCTION public.touch_user_streak(
    target_user_id uuid,
    activity_date date DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    current_streak integer,
    longest_streak integer,
    last_activity_date date
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    existing_streak record;
    next_current_streak integer := 1;
    next_longest_streak integer := 1;
BEGIN
    SELECT *
    INTO existing_streak
    FROM public.user_streaks
    WHERE user_id = target_user_id;

    IF existing_streak.user_id IS NOT NULL THEN
        IF existing_streak.last_activity_date = activity_date THEN
            next_current_streak := existing_streak.current_streak;
            next_longest_streak := existing_streak.longest_streak;
        ELSIF existing_streak.last_activity_date = activity_date - 1 THEN
            next_current_streak := existing_streak.current_streak + 1;
            next_longest_streak := GREATEST(existing_streak.longest_streak, next_current_streak);
        ELSE
            next_current_streak := 1;
            next_longest_streak := GREATEST(existing_streak.longest_streak, 1);
        END IF;
    END IF;

    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_activity_date, updated_at)
    VALUES (target_user_id, next_current_streak, next_longest_streak, activity_date, now())
    ON CONFLICT (user_id)
    DO UPDATE SET
        current_streak = EXCLUDED.current_streak,
        longest_streak = EXCLUDED.longest_streak,
        last_activity_date = EXCLUDED.last_activity_date,
        updated_at = now();

    RETURN QUERY
    SELECT
        streaks.current_streak,
        streaks.longest_streak,
        streaks.last_activity_date
    FROM public.user_streaks streaks
    WHERE streaks.user_id = target_user_id;
END;
$$;

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

  PERFORM public.touch_user_streak(target_user_id, CURRENT_DATE);
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

  PERFORM public.touch_user_streak(target_user_id, CURRENT_DATE);
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_usage(target_user_id uuid, usage_type text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    usage_total integer;
BEGIN
    INSERT INTO public.usage_logs (user_id, feature_name, action, metadata)
    VALUES (
        target_user_id,
        usage_type,
        'increment',
        jsonb_build_object('source', 'increment_usage')
    );

    PERFORM public.touch_user_streak(target_user_id, CURRENT_DATE);

    SELECT COUNT(*)::integer
    INTO usage_total
    FROM public.usage_logs
    WHERE user_id = target_user_id
      AND feature_name = usage_type
      AND created_at > (now() - interval '30 days');

    RETURN usage_total;
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
    s.current_period_end::timestamp with time zone,
    s.cancel_at_period_end
  FROM public.subscriptions s
  WHERE s.user_id = target_user_id
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_achievements(target_user_id uuid)
RETURNS TABLE(
    id uuid,
    achievement_key text,
    title text,
    description text,
    icon text,
    unlocked_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_stats record;
BEGIN
    SELECT * INTO v_stats FROM public.get_user_stats(target_user_id);

    RETURN QUERY
    WITH eligible_achievements AS (
        SELECT achievement.*
        FROM public.achievements achievement
        WHERE CASE achievement.condition_type
            WHEN 'total_budgets' THEN COALESCE(v_stats.total_budgets, 0) >= achievement.threshold
            WHEN 'completed_tasks' THEN COALESCE(v_stats.completed_tasks, 0) >= achievement.threshold
            WHEN 'total_plans' THEN COALESCE(v_stats.total_plans, 0) >= achievement.threshold
            WHEN 'current_streak' THEN COALESCE(v_stats.current_streak, 0) >= achievement.threshold
            WHEN 'total_forum_posts' THEN COALESCE(v_stats.total_forum_posts, 0) >= achievement.threshold
            ELSE false
        END
    ),
    inserted AS (
        INSERT INTO public.user_achievements (user_id, achievement_id)
        SELECT target_user_id, eligible.id
        FROM eligible_achievements eligible
        LEFT JOIN public.user_achievements existing
          ON existing.user_id = target_user_id
         AND existing.achievement_id = eligible.id
        WHERE existing.id IS NULL
        RETURNING achievement_id, unlocked_at
    )
    SELECT
        achievement.id,
        achievement.achievement_key,
        achievement.title,
        achievement.description,
        achievement.icon,
        inserted.unlocked_at
    FROM inserted
    JOIN public.achievements achievement
      ON achievement.id = inserted.achievement_id;
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
    MAX(ul.created_at)::timestamp with time zone as last_used
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
    v_user_current_streak integer;
    v_user_longest_streak integer;
    v_total_budgets bigint := 0;
    v_total_forum_posts bigint := 0;
    v_total_forum_replies bigint := 0;
    v_total_apartments_saved bigint := 0;
    v_total_videos_watched bigint := 0;
    v_total_plans bigint := 0;
    v_completed_tasks bigint := 0;
BEGIN
    -- Get simple scalar values first
    SELECT us.last_login INTO v_last_login FROM public.user_stats us WHERE us.user_id = user_id_input;

    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'user_streaks'
    ) THEN
        SELECT streaks.current_streak, streaks.longest_streak
        INTO v_user_current_streak, v_user_longest_streak
        FROM public.user_streaks streaks
        WHERE streaks.user_id = user_id_input;
    END IF;

    IF to_regclass('public.user_budgets') IS NOT NULL THEN
        EXECUTE 'SELECT count(*) FROM public.user_budgets WHERE user_id = $1'
        INTO v_total_budgets
        USING user_id_input;
    END IF;

    IF to_regclass('public.forum_posts') IS NOT NULL THEN
        EXECUTE 'SELECT count(*) FROM public.forum_posts WHERE user_id = $1'
        INTO v_total_forum_posts
        USING user_id_input;
    END IF;

    IF to_regclass('public.forum_replies') IS NOT NULL THEN
        EXECUTE 'SELECT count(*) FROM public.forum_replies WHERE user_id = $1'
        INTO v_total_forum_replies
        USING user_id_input;
    END IF;

    IF to_regclass('public.saved_apartments') IS NOT NULL THEN
        EXECUTE 'SELECT count(*) FROM public.saved_apartments WHERE user_id = $1'
        INTO v_total_apartments_saved
        USING user_id_input;
    END IF;

    IF to_regclass('public.video_progress') IS NOT NULL THEN
        EXECUTE 'SELECT count(*) FROM public.video_progress WHERE user_id = $1 AND completed = true'
        INTO v_total_videos_watched
        USING user_id_input;
    END IF;

    IF to_regclass('public.user_plans') IS NOT NULL THEN
        EXECUTE 'SELECT count(*) FROM public.user_plans WHERE user_id = $1'
        INTO v_total_plans
        USING user_id_input;
    END IF;

    IF to_regclass('public.user_tasks') IS NOT NULL THEN
        EXECUTE 'SELECT count(*) FROM public.user_tasks WHERE user_id = $1 AND status = ''completed'''
        INTO v_completed_tasks
        USING user_id_input;
    END IF;

    RETURN QUERY
    SELECT
        v_total_budgets as total_budgets,
        v_total_forum_posts as total_forum_posts,
        v_total_forum_replies as total_forum_replies,
        v_total_apartments_saved as total_apartments_saved,
        v_total_videos_watched as total_videos_watched,
        COALESCE(v_last_login, now()::timestamp with time zone) as last_login,
        v_total_plans as total_plans,
        v_completed_tasks as completed_tasks,
        COALESCE(v_user_current_streak, 0) as current_streak,
        COALESCE(v_user_longest_streak, 0) as longest_streak;
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
    v_result jsonb;
BEGIN
    -- Fetch stats
    SELECT * INTO v_stats FROM public.get_user_stats(target_user_id);

    v_result := jsonb_build_object(
        'stats', jsonb_build_object(
            'total_budgets', v_stats.total_budgets,
            'total_forum_posts', v_stats.total_forum_posts,
            'total_apartments_saved', v_stats.total_apartments_saved,
            'total_videos_watched', v_stats.total_videos_watched,
            'last_login', v_stats.last_login,
            'completed_tasks', v_stats.completed_tasks
        ),
        'subscription', COALESCE(
            (
                SELECT jsonb_build_object(
                    'tier', sub.tier,
                    'status', sub.status,
                    'current_period_end', sub.current_period_end
                )
                FROM public.get_user_subscription(target_user_id) sub
                LIMIT 1
            ),
            jsonb_build_object(
                'tier', null,
                'status', null,
                'current_period_end', null
            )
        )
    );
    
    RETURN v_result;
END;
$$;
