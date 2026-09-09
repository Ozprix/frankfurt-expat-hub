# Frankfurt Expat Services

React/Vite app for English-speaking expats moving to Frankfurt. The product combines free planning tools, relocation checklists, a vetted provider directory, community forum, and account-based progress tracking.

## Current Product Scope

- Public marketing pages, guides, directory pages, and SEO tool landing pages.
- Free tools at `/tools`, including salary/tax estimation, currency conversion, QR generation, and password generation.
- Protected account area with dashboard, first-month checklist state, document tracker, budget planner, and Tax Prep Hub.
- Tax Prep Hub at `/tax-prep` for organizing German tax return documents before working with a Steuerberater.
- Blog posts can be hydrated from Contentful, with optional queue-based Supabase automation for generated drafts.
- Supabase Auth, Postgres, RLS-backed user state, and Edge Functions for contact, checklist delivery, reminders, and selected admin workflows.
- Stripe implementation notes exist, but paid checkout is currently shelved during the free-growth phase.

## Tech Stack

- React 18 + Vite
- React Router
- Tailwind CSS + Radix UI primitives
- Lucide icons
- Supabase Auth, Postgres, Storage, and Edge Functions
- Netlify deployment config
- jsPDF export utilities

## Local Development

```bash
npm install
npm run dev
```

The dev server runs on [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` and provide the deployment project values:

```bash
cp .env.example .env
```

Required for normal app behavior:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Optional services are documented in `docs/live-supabase-launch-checklist.md`, `PAYMENT_SETUP.md`, and `STRIPE_INTEGRATION.md`.

Blog CMS and generation setup is documented in `docs/contentful-blog-automation.md`.

## Verification Before Deploy

Run these before pushing a deploy:

```bash
node --test src/utils/taxPrep.test.js
node --test src/utils/contentfulBlogPost.test.js
npm run lint
npm run build
```

`npm run build` also regenerates `public/llms.txt` and `public/sitemap.xml` through `tools/generate-llms.js`.

## Tax Prep Hub Notes

The Tax Prep Hub is a protected/noindex workflow. It reuses the existing `public.user_document_checklist` table by storing rows with `taxprep-` prefixed `document_id` values, so no new migration is required for the MVP. User changes sync to Supabase and fall back to localStorage if cross-device sync is unavailable.

Key files:

- `src/pages/TaxPrepPage.jsx`
- `src/hooks/useTaxPrepDocuments.js`
- `src/utils/taxPrep.js`
- `src/utils/taxPrep.test.js`

## Deploy Notes

- Hosting is configured through `netlify.toml`.
- Apply and verify Supabase SQL/function setup with `docs/live-supabase-launch-checklist.md`.
- Do not deploy or promote Stripe payment functions until the paid phase is intentionally reintroduced.
- Protected routes such as `/dashboard`, `/documents`, and `/tax-prep` should stay noindex.
