
-- Forum Tables
CREATE TABLE IF NOT EXISTS public.forum_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  slug TEXT UNIQUE,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  category_id UUID REFERENCES public.forum_categories(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.forum_replies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_marked_helpful BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video Tables
CREATE TABLE IF NOT EXISTS public.video_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  slug TEXT UNIQUE,
  video_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES public.video_categories(id),
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  views INTEGER DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  transcript TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.video_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  video_id UUID REFERENCES public.videos(id) NOT NULL,
  watched_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_watched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Cost Calculator Tables
CREATE TABLE IF NOT EXISTS public.cost_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cost_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES public.cost_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  average_cost NUMERIC(10, 2),
  currency TEXT DEFAULT 'EUR',
  frequency TEXT DEFAULT 'monthly',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  total_monthly_budget NUMERIC(10, 2),
  currency TEXT DEFAULT 'EUR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_budget_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  budget_id UUID REFERENCES public.user_budgets(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.cost_categories(id),
  name TEXT NOT NULL,
  estimated_cost NUMERIC(10, 2) DEFAULT 0,
  actual_cost NUMERIC(10, 2) DEFAULT 0,
  frequency TEXT DEFAULT 'monthly',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Apartment Finder Tables
CREATE TABLE IF NOT EXISTS public.apartments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  external_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2),
  currency TEXT DEFAULT 'EUR',
  rooms NUMERIC(3, 1),
  size_sqm NUMERIC(10, 2),
  address TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  neighborhood TEXT,
  images TEXT[],
  amenities TEXT[],
  pet_friendly BOOLEAN DEFAULT FALSE,
  furnished BOOLEAN DEFAULT FALSE,
  available_from DATE,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  source TEXT,
  source_url TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.saved_apartments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  apartment_id UUID REFERENCES public.apartments(id) NOT NULL,
  notes TEXT,
  rating INTEGER,
  status TEXT DEFAULT 'interested', -- interested, contacted, viewed, rejected, rented
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, apartment_id)
);

-- Enable RLS
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_apartments ENABLE ROW LEVEL SECURITY;

-- Create Policies (Simplified for brevity, ensuring public read)
CREATE POLICY "Public read categories" ON public.forum_categories FOR SELECT USING (true);
CREATE POLICY "Public read posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Auth create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public read videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "User progress" ON public.video_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public read apartments" ON public.apartments FOR SELECT USING (true);
CREATE POLICY "User saved apartments" ON public.saved_apartments FOR ALL USING (auth.uid() = user_id);

-- Seeding (Simplified)
INSERT INTO public.forum_categories (name, icon, slug) VALUES
('Housing', '🏠', 'housing'),
('Visa & Immigration', '🛂', 'visa-immigration'),
('Jobs & Career', '💼', 'jobs-career'),
('Social Life', '🤝', 'social-life'),
('Banking & Finance', '🏦', 'banking-finance'),
('Healthcare', '🏥', 'healthcare'),
('Food & Lifestyle', '🍽️', 'food-lifestyle'),
('General Questions', '❓', 'general');

INSERT INTO public.video_categories (name, icon, slug) VALUES
('Getting Started', '🏁', 'getting-started'),
('Bureaucracy', '📝', 'bureaucracy'),
('Housing Hunt', '🏘️', 'housing-hunt'),
('German Language', '🗣️', 'german-language'),
('Working in Frankfurt', '💼', 'working'),
('Daily Life', '🚲', 'daily-life');
