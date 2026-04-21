
-- Add new columns to user_budgets
ALTER TABLE public.user_budgets 
ADD COLUMN IF NOT EXISTS custom_fields jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS shared_with jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS is_template boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS template_name text;

-- Create budget_templates table for system presets
CREATE TABLE IF NOT EXISTS public.budget_templates (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    total_amount numeric(10, 2) NOT NULL,
    currency text DEFAULT 'EUR',
    category_breakdown jsonb DEFAULT '[]'::jsonb, -- Array of objects { category_name, amount, items: [] }
    is_preset boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for budget_templates
ALTER TABLE public.budget_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view budget templates" 
ON public.budget_templates FOR SELECT USING (true);

-- Seed Preset Templates
INSERT INTO public.budget_templates (name, description, total_amount, category_breakdown) VALUES
(
    'Student Budget', 
    'Optimized for university students with shared housing and student discounts.',
    1200.00,
    '[
        {"category_name": "Housing", "items": [{"name": "Shared Room (WG)", "estimated_cost": 550}, {"name": "Utilities Share", "estimated_cost": 50}]},
        {"category_name": "Food & Groceries", "items": [{"name": "Groceries (Aldi/Lidl)", "estimated_cost": 200}, {"name": "Mensa Lunch", "estimated_cost": 80}]},
        {"category_name": "Transport", "items": [{"name": "Semester Ticket", "estimated_cost": 0}, {"name": "Bike Maintenance", "estimated_cost": 10}]},
        {"category_name": "Entertainment", "items": [{"name": "Student Parties", "estimated_cost": 100}, {"name": "Streaming", "estimated_cost": 15}]},
        {"category_name": "Education", "items": [{"name": "Books & Supplies", "estimated_cost": 30}, {"name": "Semester Fee (Savings)", "estimated_cost": 50}]},
        {"category_name": "Health", "items": [{"name": "Student Health Insurance", "estimated_cost": 120}]}
    ]'::jsonb
),
(
    'Young Professional', 
    'Balanced lifestyle for early career professionals in Frankfurt.',
    2500.00,
    '[
        {"category_name": "Housing", "items": [{"name": "1-Room Apartment", "estimated_cost": 950}, {"name": "Electricity & Internet", "estimated_cost": 80}]},
        {"category_name": "Food & Groceries", "items": [{"name": "Supermarket", "estimated_cost": 300}, {"name": "Lunch at Work", "estimated_cost": 150}, {"name": "Dining Out", "estimated_cost": 150}]},
        {"category_name": "Transport", "items": [{"name": "Deutschlandticket", "estimated_cost": 49}, {"name": "Uber/Taxi", "estimated_cost": 30}]},
        {"category_name": "Entertainment", "items": [{"name": "Gym Membership", "estimated_cost": 40}, {"name": "Weekend Activities", "estimated_cost": 200}]},
        {"category_name": "Savings", "items": [{"name": "ETF Savings Plan", "estimated_cost": 300}, {"name": "Emergency Fund", "estimated_cost": 100}]}
    ]'::jsonb
),
(
    'Family of Three', 
    'Comprehensive budget for a small family including childcare.',
    4000.00,
    '[
        {"category_name": "Housing", "items": [{"name": "3-Room Apartment", "estimated_cost": 1600}, {"name": "Utilities", "estimated_cost": 250}]},
        {"category_name": "Food & Groceries", "items": [{"name": "Family Groceries", "estimated_cost": 600}, {"name": "School Lunch", "estimated_cost": 80}]},
        {"category_name": "Childcare & Education", "items": [{"name": "Kita/School Fees", "estimated_cost": 250}, {"name": "Activities/Sports", "estimated_cost": 100}]},
        {"category_name": "Transport", "items": [{"name": "Car Lease/Maintenance", "estimated_cost": 300}, {"name": "Fuel", "estimated_cost": 100}]},
        {"category_name": "Health", "items": [{"name": "Family Insurance Add-ons", "estimated_cost": 50}, {"name": "Medication", "estimated_cost": 30}]}
    ]'::jsonb
),
(
    'Minimalist', 
    'Frugal living focusing on essentials and high savings rate.',
    800.00,
    '[
        {"category_name": "Housing", "items": [{"name": "Small WG Room", "estimated_cost": 450}]},
        {"category_name": "Food & Groceries", "items": [{"name": "Basic Groceries", "estimated_cost": 150}]},
        {"category_name": "Transport", "items": [{"name": "Bike", "estimated_cost": 0}]},
        {"category_name": "Health", "items": [{"name": "Basic Insurance", "estimated_cost": 110}]},
        {"category_name": "Misc", "items": [{"name": "Phone Plan", "estimated_cost": 10}, {"name": "Hygiene", "estimated_cost": 20}]}
    ]'::jsonb
),
(
    'Comfortable Expat', 
    'High-end lifestyle with travel and convenience.',
    3500.00,
    '[
        {"category_name": "Housing", "items": [{"name": "Modern Apartment (Nordend)", "estimated_cost": 1400}, {"name": "Cleaning Service", "estimated_cost": 120}]},
        {"category_name": "Food & Groceries", "items": [{"name": "Organic Groceries", "estimated_cost": 400}, {"name": "Restaurants & Bars", "estimated_cost": 400}]},
        {"category_name": "Travel", "items": [{"name": "Weekend Trips", "estimated_cost": 500}]},
        {"category_name": "Transport", "items": [{"name": "Car Share/Rental", "estimated_cost": 200}]},
        {"category_name": "Shopping", "items": [{"name": "Clothing & Gadgets", "estimated_cost": 200}]}
    ]'::jsonb
);
