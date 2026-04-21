/**
 * Contentful Delivery API service
 *
 * Content type ID expected in Contentful: "blogPost"
 *
 * Required fields on that content type:
 *   title        Short text
 *   slug         Short text  (unique, validated)
 *   description  Long text   (medium — used as excerpt/meta)
 *   category     Short text  (Bureaucracy | Housing | Banking | Tax | Healthcare | Insurance | Visa)
 *   date         Date        (publish date, ISO)
 *   readingTime  Short text  (e.g. "5 min read")
 *   heroImage    Media       (image asset)
 *   imageAlt     Short text
 *   sections     JSON Object (array of { heading: string, body: string })
 *   links        JSON Object (array of { label: string, href: string }) — optional
 *   featured     Boolean     — optional, marks the featured/pinned post
 *
 * Env vars needed in .env (prefix with VITE_ for Vite to expose them):
 *   VITE_CONTENTFUL_SPACE_ID=xxxxxxxxxxxx
 *   VITE_CONTENTFUL_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 */

import { createClient } from 'contentful';

const SPACE_ID     = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
const CONTENT_TYPE = 'blogPost';

// Lazy-init the client so missing env vars don't crash the whole app
let _client = null;
function getClient() {
  if (!_client) {
    if (!SPACE_ID || !ACCESS_TOKEN) return null;
    _client = createClient({ space: SPACE_ID, accessToken: ACCESS_TOKEN });
  }
  return _client;
}

// ---------------------------------------------------------------------------
// Shape adapter — converts a Contentful entry into the blogPosts.js shape
// so BlogPage / BlogPostPage need zero changes to their rendering logic.
// ---------------------------------------------------------------------------
function adaptEntry(entry) {
  const f = entry.fields;
  return {
    slug:        f.slug,
    title:       f.title,
    description: f.description,
    category:    f.category,
    date:        f.date ? f.date.split('T')[0] : new Date().toISOString().split('T')[0],
    readingTime: f.readingTime || '5 min read',
    imageUrl:    f.heroImage?.fields?.file?.url
                   ? `https:${f.heroImage.fields.file.url}?w=1400&fm=webp&q=80`
                   : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80',
    imageAlt:    f.imageAlt || f.title,
    sections:    Array.isArray(f.sections) ? f.sections : [],
    links:       Array.isArray(f.links)    ? f.links    : [],
    featured:    f.featured === true,
    // Pass through so BlogPostPage can detect Contentful source
    _source: 'contentful',
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch all published blog posts, newest first.
 * Returns null when Contentful is not configured (falls back to static data).
 */
export async function fetchAllPosts({ limit = 200 } = {}) {
  const client = getClient();
  if (!client) return null;

  try {
    const res = await client.getEntries({
      content_type: CONTENT_TYPE,
      order:        '-fields.date',
      limit,
      include:      2, // resolve linked assets (heroImage)
    });
    return res.items.map(adaptEntry);
  } catch (err) {
    console.error('[Contentful] fetchAllPosts failed:', err.message);
    return null;
  }
}

/**
 * Fetch a single post by slug.
 * Returns null when not found or Contentful not configured.
 */
export async function fetchPostBySlug(slug) {
  const client = getClient();
  if (!client) return null;

  try {
    const res = await client.getEntries({
      content_type: CONTENT_TYPE,
      'fields.slug': slug,
      limit:   1,
      include: 2,
    });
    if (!res.items.length) return null;
    return adaptEntry(res.items[0]);
  } catch (err) {
    console.error('[Contentful] fetchPostBySlug failed:', err.message);
    return null;
  }
}
