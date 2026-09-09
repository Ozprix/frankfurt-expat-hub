-- Frankfurt Answer Library / Niche Data Refinery
-- Public answer pages must be generated only from records with status = reviewed.

CREATE TABLE IF NOT EXISTS public.knowledge_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  risk_tier text NOT NULL CHECK (risk_tier IN ('low', 'medium', 'high')),
  primary_cta text NOT NULL CHECK (primary_cta IN ('checklist', 'tool', 'directory', 'referral')),
  review_cadence text NOT NULL CHECK (review_cadence IN ('weekly', 'monthly', 'quarterly')),
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'researching', 'reviewed', 'stale', 'retired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.knowledge_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publisher text NOT NULL,
  title text NOT NULL,
  url text UNIQUE NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('official', 'provider', 'community', 'editorial')),
  published_at date,
  checked_at date NOT NULL,
  archived_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.knowledge_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.knowledge_topics(id) ON DELETE CASCADE,
  claim_type text NOT NULL CHECK (claim_type IN ('requirement', 'document', 'office', 'appointment', 'processing_time', 'tip', 'escalation')),
  answer_en text NOT NULL,
  document_name_de text,
  document_name_en text,
  form_url text,
  confidence text NOT NULL CHECK (confidence IN ('official', 'provider_confirmed', 'community_tip', 'unknown')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'stale', 'retired')),
  last_verified_at date,
  review_due_at date,
  reviewer text,
  change_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((status <> 'reviewed') OR (last_verified_at IS NOT NULL AND review_due_at IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS public.knowledge_record_sources (
  record_id uuid NOT NULL REFERENCES public.knowledge_records(id) ON DELETE CASCADE,
  source_id uuid NOT NULL REFERENCES public.knowledge_sources(id) ON DELETE CASCADE,
  PRIMARY KEY (record_id, source_id)
);

CREATE TABLE IF NOT EXISTS public.knowledge_review_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.knowledge_topics(id) ON DELETE CASCADE,
  reviewed_at timestamptz NOT NULL DEFAULT now(),
  reviewer text NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('no_change', 'updated', 'stale', 'retired')),
  notes text
);

ALTER TABLE public.knowledge_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_record_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_review_runs ENABLE ROW LEVEL SECURITY;

-- Deliberately do not add public write policies. Publish through an authenticated
-- admin workflow; expose only reviewed records through a controlled public view.
CREATE OR REPLACE VIEW public.public_knowledge_records AS
SELECT r.*
FROM public.knowledge_records r
WHERE r.status = 'reviewed'
  AND r.last_verified_at IS NOT NULL
  AND r.review_due_at >= CURRENT_DATE;
