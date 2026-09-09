# Contentful Blog Automation

This workflow generates Frankfurt Expat Services blog posts from an approved Supabase topic queue and writes them to Contentful.

## Architecture

1. Editors seed topics into `public.blog_topic_queue`.
2. A scheduler calls the Supabase Edge Function `generate-blog-post`.
3. The function checks `BLOG_GENERATION_SECRET` and `BLOG_MAX_DAILY_POSTS`.
4. The function locks the next queued topic, asks Anthropic for structured post JSON, and creates a Contentful `blogPost` entry.
5. By default, the entry stays as a Contentful draft. Set `BLOG_AUTO_PUBLISH=true` only when you want posts published automatically.
6. The React app reads published Contentful posts through the Delivery API and falls back to static posts when Contentful is unavailable.

## Contentful Content Model

Content type ID: `blogPost`

Required fields:

- `title` short text
- `slug` short text, unique
- `description` long text
- `category` short text: `Bureaucracy`, `Housing`, `Banking`, `Tax`, `Healthcare`, `Insurance`, or `Visa`
- `date` date
- `readingTime` short text
- `imageAlt` short text
- `sections` JSON object containing an array of `{ heading, body }`
- `links` JSON object containing an array of `{ label, href }`
- `featured` boolean

Optional fields:

- `heroImage` media asset
- `unsplashPhotoId` short text

Generated posts use `unsplashPhotoId` so no asset upload is required. Manually edited posts can use `heroImage`, which takes precedence.

## Supabase SQL

Apply:

```sql
src/database/blog_automation.sql
```

For a fresh project, `src/database/schema.sql` also includes the queue table and service-role policy.

## Edge Function Secrets

Set these in Supabase Edge Function secrets:

```bash
supabase secrets set ANTHROPIC_API_KEY=...
supabase secrets set ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
supabase secrets set CONTENTFUL_SPACE_ID=...
supabase secrets set CONTENTFUL_ENVIRONMENT=master
supabase secrets set CONTENTFUL_MGMT_TOKEN=...
supabase secrets set BLOG_GENERATION_SECRET=...
supabase secrets set BLOG_AUTO_PUBLISH=false
supabase secrets set BLOG_MAX_DAILY_POSTS=1
```

Set these in Netlify environment variables for the browser app:

```bash
VITE_CONTENTFUL_SPACE_ID=...
VITE_CONTENTFUL_ACCESS_TOKEN=...
```

Use Contentful Delivery API token for `VITE_CONTENTFUL_ACCESS_TOKEN`. Do not expose the management token in any `VITE_` variable.

## Deploy Function

```bash
supabase functions deploy generate-blog-post
```

## Manual Smoke Test

Call the function once:

```bash
curl -X POST "$SUPABASE_URL/functions/v1/generate-blog-post" \
  -H "Authorization: Bearer $BLOG_GENERATION_SECRET"
```

Expected result:

```json
{ "ok": true, "slug": "...", "entryId": "...", "published": false }
```

Confirm:

1. `public.blog_topic_queue.status` moved to `generated` or `published`.
2. `contentful_entry_id` is populated.
3. The Contentful entry exists.
4. If `BLOG_AUTO_PUBLISH=false`, review and publish the draft in Contentful.
5. If `BLOG_AUTO_PUBLISH=true`, confirm the post appears at `/blog` and `/blog/<slug>`.

## Scheduling

Once per day:

```cron
0 8 * * *
```

Twice per day:

```cron
0 8,16 * * *
```

Use Supabase scheduled functions, Netlify scheduled functions, or another trusted scheduler that can send:

```http
POST /functions/v1/generate-blog-post
Authorization: Bearer <BLOG_GENERATION_SECRET>
```

Keep `BLOG_MAX_DAILY_POSTS=1` for one post per day. Set `BLOG_MAX_DAILY_POSTS=2` only when the queue and review process can support twice-daily publishing.

## Quality Guardrails

- Seed only specific, high-intent Frankfurt topics.
- Keep `BLOG_AUTO_PUBLISH=false` until generated drafts are consistently acceptable.
- Review factual claims, official requirements, and legal/tax caveats before publishing.
- Delete or revise weak drafts in Contentful instead of publishing them.
