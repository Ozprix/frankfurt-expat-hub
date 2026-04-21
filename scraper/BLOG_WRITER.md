# Blog Draft Writer

This local workflow adapts the useful parts of `jordan-jakisa/blog_post_writer` for this React site:

1. Search web references for a topic.
2. Fetch public page text.
3. Keep relevant chunks.
4. Ask DeepSeek to draft structured JSON.
5. Save the result as a local draft.

It does **not** publish directly to the live website. Drafts go to `blog-drafts/`, which is ignored by git.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r scraper/requirements.txt
```

Add your local-only DeepSeek key to `.env`:

```bash
DEEPSEEK_API_KEY=your_key_here
DEEPSEEK_MODEL=deepseek-chat
```

Do not add `DEEPSEEK_API_KEY` to any `VITE_` variable. Browser variables are public.

## Create A Draft

```bash
python scraper/blog_writer.py \
  --topic "Anmeldung Frankfurt checklist for expats" \
  --max-sources 6
```

The output goes to:

```text
blog-drafts/<slug>.json
```

## Publish A Reviewed Post

Open the draft JSON, check every claim against the listed sources, then manually copy the approved content into:

```text
src/data/blogPosts.js
```

Use this workflow intentionally. It prevents AI drafts, source notes, and rough research from appearing on the public site before review.
