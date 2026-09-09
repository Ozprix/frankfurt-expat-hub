/**
 * generate-blog-post
 *
 * Supabase Edge Function for scheduled blog generation.
 *
 * Flow:
 * 1. Verify a shared generation secret when BLOG_GENERATION_SECRET is set.
 * 2. Enforce a daily generation limit.
 * 3. Lock the next queued topic from public.blog_topic_queue.
 * 4. Ask Claude to write a structured Frankfurt expat guide.
 * 5. Create a Contentful blogPost entry.
 * 6. Publish only when BLOG_AUTO_PUBLISH=true; otherwise leave as draft.
 *
 * Required secrets:
 *   ANTHROPIC_API_KEY
 *   CONTENTFUL_SPACE_ID
 *   CONTENTFUL_MGMT_TOKEN
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Recommended secrets:
 *   BLOG_GENERATION_SECRET
 *   CONTENTFUL_ENVIRONMENT=master
 *   BLOG_AUTO_PUBLISH=false
 *   BLOG_MAX_DAILY_POSTS=1
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type BlogTopic = {
  id: string;
  topic: string;
  category: string;
  focus_keywords: string | null;
};

type GeneratedPost = {
  title: string;
  slug: string;
  description: string;
  readingTime: string;
  imageAlt: string;
  sections: Array<{ heading: string; body: string }>;
  links: Array<{ label: string; href: string }>;
};

const requiredEnv = (name: string) => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required secret: ${name}`);
  return value;
};

const ANTHROPIC_KEY = requiredEnv('ANTHROPIC_API_KEY');
const CTF_SPACE = requiredEnv('CONTENTFUL_SPACE_ID');
const CTF_MGMT_TOKEN = requiredEnv('CONTENTFUL_MGMT_TOKEN');
const CTF_ENV = Deno.env.get('CONTENTFUL_ENVIRONMENT') || 'master';
const SUPABASE_URL = requiredEnv('SUPABASE_URL');
const SERVICE_ROLE_KEY = requiredEnv('SUPABASE_SERVICE_ROLE_KEY');
const GENERATION_SECRET = Deno.env.get('BLOG_GENERATION_SECRET');
const AUTO_PUBLISH = Deno.env.get('BLOG_AUTO_PUBLISH') === 'true';
const MAX_DAILY_POSTS = Number.parseInt(Deno.env.get('BLOG_MAX_DAILY_POSTS') || '1', 10);

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const CATEGORY_IMAGES: Record<string, string> = {
  Bureaucracy: 'photo-1560448204-e02f11c3d0e2',
  Housing: 'photo-1560185893-a55cbc8c57e8',
  Banking: 'photo-1554224155-6726b3ff858f',
  Tax: 'photo-1586281380117-5a60ae2050cc',
  Healthcare: 'photo-1579154204601-01588f351e67',
  Insurance: 'photo-1450101499163-c8848c66ca85',
  Visa: 'photo-1578662996442-48f60103fc96',
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const verifySecret = (req: Request) => {
  if (!GENERATION_SECRET) return true;

  const authHeader = req.headers.get('authorization') || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : '';
  const explicit = req.headers.get('x-blog-generation-secret') || '';

  return bearer === GENERATION_SECRET || explicit === GENERATION_SECRET;
};

const assertDailyLimit = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const { count, error } = await supabase
    .from('blog_topic_queue')
    .select('id', { count: 'exact', head: true })
    .gte('generated_at', `${today}T00:00:00.000Z`)
    .lt('generated_at', `${today}T23:59:59.999Z`)
    .in('status', ['generated', 'published']);

  if (error) throw error;
  if ((count || 0) >= MAX_DAILY_POSTS) {
    throw new Error(`Daily blog generation limit reached (${MAX_DAILY_POSTS})`);
  }
};

const lockNextTopic = async (): Promise<BlogTopic> => {
  const { data: candidates, error: fetchError } = await supabase
    .from('blog_topic_queue')
    .select('id, topic, category, focus_keywords')
    .eq('used', false)
    .in('status', ['queued', 'failed'])
    .lt('attempts', 3)
    .order('priority', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(5);

  if (fetchError) throw fetchError;
  if (!candidates?.length) throw new Error('No eligible queued blog topics');

  for (const candidate of candidates) {
    const { data, error } = await supabase
      .from('blog_topic_queue')
      .update({
        status: 'processing',
        locked_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', candidate.id)
      .eq('used', false)
      .in('status', ['queued', 'failed'])
      .select('id, topic, category, focus_keywords')
      .single();

    if (!error && data) return data as BlogTopic;
  }

  throw new Error('Could not lock a blog topic');
};

const incrementAttempt = async (topicId: string, updates: Record<string, unknown>) => {
  const { data } = await supabase
    .from('blog_topic_queue')
    .select('attempts')
    .eq('id', topicId)
    .single();

  const attempts = Number(data?.attempts || 0) + 1;
  await supabase
    .from('blog_topic_queue')
    .update({ ...updates, attempts, updated_at: new Date().toISOString() })
    .eq('id', topicId);
};

const generatePost = async (topic: BlogTopic): Promise<GeneratedPost> => {
  const prompt = `You are an expert content writer for Frankfurt Expat Services, a practical guide platform for English-speaking expats settling in Frankfurt, Germany.

Write a practical, SEO-optimized blog post for this approved topic.

Topic: ${topic.topic}
Category: ${topic.category}
Target keywords: ${topic.focus_keywords || ''}

Return only a valid JSON object with this exact structure:
{
  "title": "Clear title, max 65 chars",
  "slug": "url-friendly-slug-with-hyphens",
  "description": "Meta description, 140-155 chars",
  "readingTime": "X min read",
  "imageAlt": "Descriptive alt text for the hero image",
  "sections": [
    { "heading": "Section title", "body": "Practical body text" }
  ],
  "links": [
    { "label": "Anchor text", "href": "/relevant-internal-path" }
  ]
}

Requirements:
- 5 to 7 sections.
- Each section body must be 100 to 180 words.
- Be Frankfurt-specific when relevant: mention offices, timing, local constraints, documents, or districts only when accurate.
- Do not invent legal/tax guarantees. Tell readers to verify official requirements or use a qualified advisor when needed.
- Include useful internal links only from these paths: /tools, /directory, /forum, /faq, /blog, /frankfurt-first-30-days-checklist, /tax-prep, /directory/tax-advisors-frankfurt.
- No markdown fences. No introduction outside the JSON.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: Deno.env.get('ANTHROPIC_MODEL') || 'claude-3-5-sonnet-20241022',
      max_tokens: 5000,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Claude API error: ${res.status} ${await res.text()}`);

  const data = await res.json();
  const raw = data.content?.[0]?.text?.trim() || '';
  const clean = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  const parsed = JSON.parse(clean);

  if (!parsed.title || !parsed.slug || !Array.isArray(parsed.sections)) {
    throw new Error('Generated post is missing required fields');
  }

  return parsed as GeneratedPost;
};

const createContentfulEntry = async (post: GeneratedPost, category: string) => {
  const imageId = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.Bureaucracy;
  const base = `https://api.contentful.com/spaces/${CTF_SPACE}/environments/${CTF_ENV}`;

  const entry = {
    fields: {
      title: { 'en-US': post.title },
      slug: { 'en-US': post.slug },
      description: { 'en-US': post.description },
      category: { 'en-US': category },
      date: { 'en-US': new Date().toISOString().split('T')[0] },
      readingTime: { 'en-US': post.readingTime || '5 min read' },
      imageAlt: { 'en-US': post.imageAlt || post.title },
      sections: { 'en-US': post.sections },
      links: { 'en-US': Array.isArray(post.links) ? post.links : [] },
      featured: { 'en-US': false },
      unsplashPhotoId: { 'en-US': imageId },
    },
  };

  const createRes = await fetch(`${base}/entries`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CTF_MGMT_TOKEN}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      'X-Contentful-Content-Type': 'blogPost',
    },
    body: JSON.stringify(entry),
  });

  if (!createRes.ok) {
    throw new Error(`Contentful create failed: ${createRes.status} ${await createRes.text()}`);
  }

  const created = await createRes.json();
  const entryId = created.sys.id as string;
  const version = created.sys.version as number;

  if (!AUTO_PUBLISH) return { entryId, published: false };

  const publishRes = await fetch(`${base}/entries/${entryId}/published`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${CTF_MGMT_TOKEN}`,
      'X-Contentful-Version': String(version),
    },
  });

  if (!publishRes.ok) {
    throw new Error(`Contentful publish failed: ${publishRes.status} ${await publishRes.text()}`);
  }

  return { entryId, published: true };
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
  }

  if (!verifySecret(req)) {
    return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
  }

  let topic: BlogTopic | null = null;

  try {
    await assertDailyLimit();
    topic = await lockNextTopic();

    await incrementAttempt(topic.id, { status: 'processing', error_message: null });

    const post = await generatePost(topic);
    const { entryId, published } = await createContentfulEntry(post, topic.category);

    await supabase
      .from('blog_topic_queue')
      .update({
        used: true,
        status: published ? 'published' : 'generated',
        generated_at: new Date().toISOString(),
        generated_slug: post.slug,
        contentful_entry_id: entryId,
        error_message: null,
        locked_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', topic.id);

    return jsonResponse({ ok: true, slug: post.slug, entryId, published });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (topic?.id) {
      await supabase
        .from('blog_topic_queue')
        .update({
          status: 'failed',
          error_message: message,
          locked_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', topic.id);
    }

    console.error('[generate-blog-post]', err);
    return jsonResponse({ ok: false, error: message }, 500);
  }
});
