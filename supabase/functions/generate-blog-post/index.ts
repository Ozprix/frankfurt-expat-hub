/**
 * generate-blog-post
 *
 * Supabase Edge Function — called by pg_cron up to 3× per day.
 * 1. Picks the next unpublished topic from a pre-seeded list in Supabase
 *    (table: blog_topic_queue)
 * 2. Calls Claude API to write a structured Frankfurt expat blog post
 * 3. Creates a published entry in Contentful via the Management API
 * 4. Marks the topic as used so it isn't generated again
 *
 * Required Edge Function secrets (set in Supabase Dashboard → Edge Functions → Secrets):
 *   ANTHROPIC_API_KEY          — from console.anthropic.com
 *   CONTENTFUL_SPACE_ID        — from Contentful → Space Settings → General
 *   CONTENTFUL_MGMT_TOKEN      — from Contentful → Settings → API keys → Content management tokens
 *   CONTENTFUL_ENVIRONMENT     — usually "master"
 *   SUPABASE_URL               — auto-provided
 *   SUPABASE_SERVICE_ROLE_KEY  — auto-provided
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_KEY    = Deno.env.get('ANTHROPIC_API_KEY')!;
const CTF_SPACE        = Deno.env.get('CONTENTFUL_SPACE_ID')!;
const CTF_MGMT_TOKEN   = Deno.env.get('CONTENTFUL_MGMT_TOKEN')!;
const CTF_ENV          = Deno.env.get('CONTENTFUL_ENVIRONMENT') || 'master';
const SUPABASE_URL     = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ---------------------------------------------------------------------------
// Pick next topic from the queue
// ---------------------------------------------------------------------------
async function getNextTopic() {
  const { data, error } = await supabase
    .from('blog_topic_queue')
    .select('id, topic, category, focus_keywords')
    .eq('used', false)
    .order('priority', { ascending: true })
    .limit(1)
    .single();

  if (error || !data) throw new Error('No unused topics in queue');
  return data;
}

// ---------------------------------------------------------------------------
// Generate post content via Claude
// ---------------------------------------------------------------------------
async function generatePost(topic: string, category: string, keywords: string) {
  const prompt = `You are an expert content writer for Frankfurt Expat Services, a guide platform for international professionals settling in Frankfurt, Germany.

Write a practical, SEO-optimised blog post for the following topic. The audience is English-speaking expats who are new to Germany and need clear, actionable guidance.

Topic: ${topic}
Category: ${category}
Target keywords: ${keywords}

Return your response as a valid JSON object with this exact structure:
{
  "title": "Clear, benefit-driven title (max 65 chars for SEO)",
  "slug": "url-friendly-slug-with-hyphens",
  "description": "Meta description, 140-155 chars, includes primary keyword",
  "readingTime": "X min read",
  "imageAlt": "Descriptive alt text for the hero image",
  "sections": [
    { "heading": "Section title", "body": "2-4 paragraphs of practical content..." },
    ...
  ],
  "links": [
    { "label": "Anchor text", "href": "/relevant-internal-path" }
  ]
}

Requirements:
- Write 5-7 sections, each 150-250 words
- Be specific about Frankfurt (mention Bürgeramt, Römer, specific districts etc. where relevant)
- Include practical tips, not generic advice
- Natural keyword usage — do not stuff
- links should reference existing site paths: /tools, /directory, /forum, /faq, /blog, /frankfurt-first-30-days-checklist
- Return ONLY the JSON object, no markdown fences`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Claude API error: ${res.status}`);
  const data = await res.json();
  const raw = data.content[0].text.trim();

  // Strip markdown fences if Claude wraps it anyway
  const clean = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(clean);
}

// ---------------------------------------------------------------------------
// Unsplash image mapping by category (free, no API key needed)
// ---------------------------------------------------------------------------
const CATEGORY_IMAGES: Record<string, string> = {
  Bureaucracy: 'photo-1560448204-e02f11c3d0e2',
  Housing:     'photo-1560185893-a55cbc8c57e8',
  Banking:     'photo-1554224155-6726b3ff858f',
  Tax:         'photo-1586281380117-5a60ae2050cc',
  Healthcare:  'photo-1579154204601-01588f351e67',
  Insurance:   'photo-1450101499163-c8848c66ca85',
  Visa:        'photo-1578662996442-48f60103fc96',
};

// ---------------------------------------------------------------------------
// Publish to Contentful via Management API
// ---------------------------------------------------------------------------
async function publishToContentful(post: Record<string, unknown>, category: string) {
  const imageId = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.Bureaucracy;

  const entry = {
    fields: {
      title:       { 'en-US': post.title },
      slug:        { 'en-US': post.slug },
      description: { 'en-US': post.description },
      category:    { 'en-US': category },
      date:        { 'en-US': new Date().toISOString().split('T')[0] },
      readingTime: { 'en-US': post.readingTime },
      imageAlt:    { 'en-US': post.imageAlt },
      // heroImage is left blank here — Contentful will use the default
      // You can later wire a proper Unsplash asset upload if desired
      sections:    { 'en-US': post.sections },
      links:       { 'en-US': post.links },
      featured:    { 'en-US': false },
      // Store the Unsplash photo ID so the frontend can construct the URL
      unsplashPhotoId: { 'en-US': imageId },
    },
  };

  const base = `https://api.contentful.com/spaces/${CTF_SPACE}/environments/${CTF_ENV}`;

  // Create entry
  const createRes = await fetch(`${base}/entries`, {
    method: 'POST',
    headers: {
      Authorization:           `Bearer ${CTF_MGMT_TOKEN}`,
      'Content-Type':          'application/vnd.contentful.management.v1+json',
      'X-Contentful-Content-Type': 'blogPost',
    },
    body: JSON.stringify(entry),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Contentful create failed: ${err}`);
  }

  const created = await createRes.json();
  const entryId = created.sys.id;
  const version = created.sys.version;

  // Publish the entry immediately
  const publishRes = await fetch(`${base}/entries/${entryId}/published`, {
    method: 'PUT',
    headers: {
      Authorization:          `Bearer ${CTF_MGMT_TOKEN}`,
      'X-Contentful-Version': String(version),
    },
  });

  if (!publishRes.ok) {
    const err = await publishRes.text();
    throw new Error(`Contentful publish failed: ${err}`);
  }

  return entryId;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
Deno.serve(async (req) => {
  // Allow manual trigger via POST or automated cron (no body)
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // 1. Get next topic
    const topic = await getNextTopic();

    // 2. Generate content
    const post = await generatePost(
      topic.topic,
      topic.category,
      topic.focus_keywords || '',
    );

    // 3. Publish to Contentful
    const entryId = await publishToContentful(post, topic.category);

    // 4. Mark topic as used
    await supabase
      .from('blog_topic_queue')
      .update({ used: true, generated_at: new Date().toISOString(), contentful_entry_id: entryId })
      .eq('id', topic.id);

    return new Response(
      JSON.stringify({ ok: true, slug: post.slug, entryId }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[generate-blog-post]', err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
