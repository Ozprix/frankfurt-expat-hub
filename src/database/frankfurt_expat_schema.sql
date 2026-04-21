
-- =============================================================================
-- Frankfurt Expat Services - Comprehensive Database Schema
-- Covers: Forum, Videos, Budget, Apartments, Analytics
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. FORUM SYSTEM
-- =============================================================================

-- 1.1 Forum Categories
CREATE TABLE IF NOT EXISTS public.forum_categories (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    icon text,
    slug text UNIQUE NOT NULL,
    post_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.2 Forum Posts
CREATE TABLE IF NOT EXISTS public.forum_posts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category_id uuid REFERENCES public.forum_categories(id) ON DELETE SET NULL,
    title text NOT NULL,
    content text NOT NULL,
    views integer DEFAULT 0,
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    is_pinned boolean DEFAULT false,
    is_locked boolean DEFAULT false,
    moderation_status text DEFAULT 'approved' NOT NULL,
    moderation_reason text,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.3 Forum Replies
CREATE TABLE IF NOT EXISTS public.forum_replies (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id uuid REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    is_marked_helpful boolean DEFAULT false,
    moderation_status text DEFAULT 'approved' NOT NULL,
    moderation_reason text,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.4 Forum Votes (Tracks up/down votes on posts and replies)
CREATE TABLE IF NOT EXISTS public.forum_votes (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    post_id uuid REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    reply_id uuid REFERENCES public.forum_replies(id) ON DELETE CASCADE,
    vote_type integer NOT NULL CHECK (vote_type IN (-1, 1)), -- 1 for upvote, -1 for downvote
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_post_vote UNIQUE (user_id, post_id),
    CONSTRAINT unique_reply_vote UNIQUE (user_id, reply_id),
    CONSTRAINT vote_target_check CHECK (
        (post_id IS NOT NULL AND reply_id IS NULL) OR 
        (post_id IS NULL AND reply_id IS NOT NULL)
    )
);

-- 1.5 Forum User Profiles (Gamification/Stats)
CREATE TABLE IF NOT EXISTS public.forum_user_profiles (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    reputation_score integer DEFAULT 0,
    posts_count integer DEFAULT 0,
    replies_count integer DEFAULT 0,
    helpful_count integer DEFAULT 0,
    joined_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- =============================================================================
-- 2. VIDEO TUTORIAL SYSTEM
-- =============================================================================

-- 2.1 Video Categories
CREATE TABLE IF NOT EXISTS public.video_categories (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    icon text,
    slug text UNIQUE NOT NULL,
    video_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.2 Videos
CREATE TABLE IF NOT EXISTS public.videos (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id uuid REFERENCES public.video_categories(id) ON DELETE SET NULL,
    title text NOT NULL,
    description text,
    youtube_url text NOT NULL,
    thumbnail_url text,
    duration integer, -- in seconds
    views integer DEFAULT 0,
    rating numeric(3, 2) DEFAULT 0,
    rating_count integer DEFAULT 0,
    transcript text,
    tags text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.3 Video Ratings
CREATE TABLE IF NOT EXISTS public.video_ratings (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    video_id uuid REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_video_rating UNIQUE (user_id, video_id)
);

-- 2.4 Video Progress (Tracking user watch history)
CREATE TABLE IF NOT EXISTS public.video_progress (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    video_id uuid REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
    watched_seconds integer DEFAULT 0,
    completed boolean DEFAULT false,
    last_watched timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_video_progress UNIQUE (user_id, video_id)
);


-- =============================================================================
-- 3. BUDGET & COST CALCULATOR
-- =============================================================================

-- 3.1 Cost Categories (Standard categories for templates)
CREATE TABLE IF NOT EXISTS public.cost_categories (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    icon text,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.2 Cost Items (Standard items within categories)
CREATE TABLE IF NOT EXISTS public.cost_items (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id uuid REFERENCES public.cost_categories(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    average_cost numeric(10, 2),
    currency text DEFAULT 'EUR',
    frequency text DEFAULT 'monthly', -- monthly, one-time, yearly
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.3 User Budgets
CREATE TABLE IF NOT EXISTS public.user_budgets (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    total_monthly_budget numeric(10, 2) DEFAULT 0,
    currency text DEFAULT 'EUR',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.4 User Budget Items
CREATE TABLE IF NOT EXISTS public.user_budget_items (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    budget_id uuid REFERENCES public.user_budgets(id) ON DELETE CASCADE NOT NULL,
    category_id uuid REFERENCES public.cost_categories(id) ON DELETE SET NULL,
    name text NOT NULL,
    estimated_cost numeric(10, 2) DEFAULT 0,
    actual_cost numeric(10, 2) DEFAULT 0,
    frequency text DEFAULT 'monthly',
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- =============================================================================
-- 4. APARTMENT FINDER
-- =============================================================================

-- 4.1 Apartments (Listings)
CREATE TABLE IF NOT EXISTS public.apartments (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    external_id text, -- ID from source if scraped/imported
    title text NOT NULL,
    description text,
    price numeric(10, 2) NOT NULL,
    currency text DEFAULT 'EUR',
    rooms numeric(3, 1),
    size_sqm numeric(10, 2),
    address text,
    latitude numeric(10, 8),
    longitude numeric(11, 8),
    neighborhood text,
    images text[], -- Array of image URLs
    amenities text[],
    pet_friendly boolean DEFAULT false,
    furnished boolean DEFAULT false,
    available_from date,
    contact_name text,
    contact_phone text,
    contact_email text,
    source text DEFAULT 'internal', -- internal, immoscout, wg-gesucht, etc.
    source_url text,
    last_updated timestamp with time zone DEFAULT timezone('utc'::text, now()),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4.2 Saved Apartments (Favorites)
CREATE TABLE IF NOT EXISTS public.saved_apartments (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    apartment_id uuid REFERENCES public.apartments(id) ON DELETE CASCADE NOT NULL,
    notes text,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    status text DEFAULT 'saved', -- saved, contacted, viewed, applied, rejected
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_saved_apartment UNIQUE (user_id, apartment_id)
);

-- 4.3 Apartment Viewings
CREATE TABLE IF NOT EXISTS public.apartment_viewings (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    apartment_id uuid REFERENCES public.apartments(id) ON DELETE CASCADE NOT NULL,
    viewing_date timestamp with time zone NOT NULL,
    notes text,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4.4 Apartment Contact Logs
CREATE TABLE IF NOT EXISTS public.apartment_contacts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    apartment_id uuid REFERENCES public.apartments(id) ON DELETE CASCADE NOT NULL,
    contact_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    message text,
    response_received boolean DEFAULT false,
    response_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- =============================================================================
-- 5. ANALYTICS & FEEDBACK
-- =============================================================================

-- 5.1 User Analytics (Feature usage tracking)
CREATE TABLE IF NOT EXISTS public.user_analytics (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Can be null for anon events if needed, but RLS usually requires auth
    feature_name text NOT NULL,
    action text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5.2 User Feedback
CREATE TABLE IF NOT EXISTS public.user_feedback (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    feature_name text NOT NULL,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    comment text,
    feedback_type text DEFAULT 'general', -- bug, feature_request, general
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- =============================================================================
-- ENABLE RLS ON ALL TABLES
-- =============================================================================

ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_user_profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.video_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.cost_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_budget_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apartment_viewings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apartment_contacts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- CREATE RLS POLICIES
-- =============================================================================

-- FORUM POLICIES
CREATE POLICY "Public can view forum categories" ON public.forum_categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert forum categories" ON public.forum_categories FOR INSERT WITH CHECK (auth.role() = 'service_role'); -- Or specific admin check

CREATE POLICY "Public can view forum posts" ON public.forum_posts FOR SELECT USING (moderation_status = 'approved' OR auth.uid() = user_id);
CREATE POLICY "Users can insert forum posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own forum posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own forum posts" ON public.forum_posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can view forum replies" ON public.forum_replies FOR SELECT USING (moderation_status = 'approved' OR auth.uid() = user_id);
CREATE POLICY "Users can insert forum replies" ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own forum replies" ON public.forum_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own forum replies" ON public.forum_replies FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can view forum votes" ON public.forum_votes FOR SELECT USING (true);
CREATE POLICY "Users can insert forum votes" ON public.forum_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own forum votes" ON public.forum_votes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can view forum profiles" ON public.forum_user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own forum profile" ON public.forum_user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own forum profile" ON public.forum_user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);


-- VIDEO POLICIES
CREATE POLICY "Public can view video categories" ON public.video_categories FOR SELECT USING (true);

CREATE POLICY "Public can view videos" ON public.videos FOR SELECT USING (true);

CREATE POLICY "Public can view video ratings" ON public.video_ratings FOR SELECT USING (true);
CREATE POLICY "Users can insert video ratings" ON public.video_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own video ratings" ON public.video_ratings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own video progress" ON public.video_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own video progress" ON public.video_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own video progress" ON public.video_progress FOR UPDATE USING (auth.uid() = user_id);


-- BUDGET POLICIES
CREATE POLICY "Public can view cost categories" ON public.cost_categories FOR SELECT USING (true);
CREATE POLICY "Public can view cost items" ON public.cost_items FOR SELECT USING (true);

CREATE POLICY "Users can view own budgets" ON public.user_budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budgets" ON public.user_budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budgets" ON public.user_budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budgets" ON public.user_budgets FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own budget items" ON public.user_budget_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_budgets WHERE id = budget_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own budget items" ON public.user_budget_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_budgets WHERE id = budget_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update own budget items" ON public.user_budget_items FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_budgets WHERE id = budget_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete own budget items" ON public.user_budget_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.user_budgets WHERE id = budget_id AND user_id = auth.uid())
);


-- APARTMENT POLICIES
CREATE POLICY "Public can view apartments" ON public.apartments FOR SELECT USING (true);

CREATE POLICY "Users can view own saved apartments" ON public.saved_apartments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved apartments" ON public.saved_apartments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved apartments" ON public.saved_apartments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved apartments" ON public.saved_apartments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own viewings" ON public.apartment_viewings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own viewings" ON public.apartment_viewings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own viewings" ON public.apartment_viewings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own viewings" ON public.apartment_viewings FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own contacts" ON public.apartment_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own contacts" ON public.apartment_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contacts" ON public.apartment_contacts FOR UPDATE USING (auth.uid() = user_id);


-- ANALYTICS & FEEDBACK POLICIES
CREATE POLICY "Users can insert analytics" ON public.user_analytics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view analytics" ON public.user_analytics FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Users can insert feedback" ON public.user_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view feedback" ON public.user_feedback FOR SELECT USING (auth.role() = 'service_role');


-- =============================================================================
-- SEED DATA
-- =============================================================================

-- 1. Forum Categories
INSERT INTO public.forum_categories (name, description, slug, icon) VALUES
('Housing', 'Finding apartments, contracts, landlords, and moving tips.', 'housing', 'Home'),
('Visa & Immigration', 'Blue Card, residence permits, and registration (Anmeldung).', 'visa-immigration', 'FileText'),
('Jobs & Career', 'Job hunting, contracts, workplace culture, and taxes.', 'jobs-career', 'Briefcase'),
('Social Life', 'Meetups, events, clubs, and making friends in Frankfurt.', 'social-life', 'Users'),
('Banking & Finance', 'Opening accounts, insurance, taxes, and investing.', 'banking-finance', 'CreditCard'),
('Healthcare', 'Health insurance (Krankenkasse), doctors, and emergencies.', 'healthcare', 'Heart'),
('Food & Lifestyle', 'Best restaurants, groceries, shopping, and gyms.', 'food-lifestyle', 'Coffee'),
('General Questions', 'Anything else about life in Frankfurt.', 'general', 'HelpCircle')
ON CONFLICT (slug) DO NOTHING;

-- 2. Video Categories
INSERT INTO public.video_categories (name, description, slug, icon) VALUES
('Getting Started', 'Essential first steps for your arrival.', 'getting-started', 'Flag'),
('Housing', 'Guides on finding and securing accommodation.', 'housing', 'Home'),
('Visa & Immigration', 'Bureaucracy explained simply.', 'visa-immigration', 'FileText'),
('Banking & Finance', 'Money matters made easy.', 'banking-finance', 'CreditCard'),
('Healthcare', 'Navigating the German health system.', 'healthcare', 'Heart'),
('Social Integration', 'Culture, language, and fitting in.', 'social-integration', 'Users')
ON CONFLICT (slug) DO NOTHING;

-- 3. Cost Categories
INSERT INTO public.cost_categories (name, description, icon) VALUES
('Housing', 'Rent, utilities, and household items.', 'Home'),
('Food & Groceries', 'Supermarkets, dining out, and delivery.', 'ShoppingCart'),
('Transport', 'Public transport tickets, car sharing, and bikes.', 'Train'),
('Healthcare', 'Insurance premiums and medication.', 'Heart'),
('Education', 'Language schools, university fees, and books.', 'Book'),
('Entertainment', 'Cinema, clubs, hobbies, and sports.', 'Music'),
('Utilities & Services', 'Internet, mobile plans, and subscriptions.', 'Wifi'),
('Work & Business', 'Office supplies, coworking, and software.', 'Briefcase')
ON CONFLICT DO NOTHING; -- No slug constraint on cost_categories, relying on internal ID or duplicates okay for seed if table is empty

-- =============================================================================
-- END SCHEMA
-- =============================================================================
