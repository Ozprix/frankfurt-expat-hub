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
 *   unsplashPhotoId Short text — optional fallback image ID for generated posts
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
import { adaptContentfulBlogPost } from '@/utils/contentfulBlogPost';

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
    return res.items.map(adaptContentfulBlogPost);
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
    return adaptContentfulBlogPost(res.items[0]);
  } catch (err) {
    console.error('[Contentful] fetchPostBySlug failed:', err.message);
    return null;
  }
}
