# Live Supabase Launch Checklist

Use this after every production deploy that touches auth, retention, forum, reminder state, document checklist state, or Tax Prep Hub state.

## Scope

Stripe is shelved for the current traffic and directory growth phase. Do not deploy or promote these payment functions during this launch:

1. `supabase/functions/create-checkout-session`
2. `supabase/functions/create-portal-session`
3. `supabase/functions/stripe-webhook`

The live launch path is Supabase Auth, public content data, Contentful blog hydration, optional blog automation, contact capture, checklist delivery, first-month reminders, document checklist state, Tax Prep Hub state, forum state, and conversion tracking.

## Auth

For the current acquisition phase, email confirmation should be off:

1. Open Supabase project dashboard.
2. Go to Authentication -> Providers -> Email.
3. Turn off "Confirm email".
4. Save.
5. Create a new account on the live domain and confirm it lands on `/onboarding` or `/dashboard` without requiring an email link.

The app code supports immediate sessions after signup. The Supabase dashboard setting controls whether Supabase actually returns that session.

## Required SQL

For a fresh Supabase project, run `src/database/schema.sql` first, then the launch patches below. For an existing project, run these in Supabase SQL Editor in this order if they are not already applied:

1. `src/database/user_retention_state.sql`
2. `src/database/account_retention_state.sql`
3. `src/database/forum_moderation.sql`
4. `src/database/reminder_email_jobs.sql`
5. `src/database/conversion_events.sql`
6. `src/database/checklist_delivery_requests.sql`
7. `src/database/contact_messages_schema.sql`
8. `src/database/blog_automation.sql`

Quick live checks:

```sql
select to_regclass('public.notification_preferences') as notification_preferences;
select to_regclass('public.user_checklist_state') as user_checklist_state;
select to_regclass('public.user_document_checklist') as user_document_checklist;
select to_regclass('public.reminder_email_events') as reminder_email_events;
select to_regclass('public.conversion_events') as conversion_events;
select to_regclass('public.checklist_delivery_requests') as checklist_delivery_requests;
select to_regclass('public.contact_messages') as contact_messages;
select to_regclass('public.blog_topic_queue') as blog_topic_queue;

select tablename, policyname
from pg_policies
where schemaname = 'public'
  and tablename in (
    'notification_preferences',
    'user_checklist_state',
    'user_document_checklist',
    'reminder_email_events',
    'conversion_events',
    'checklist_delivery_requests',
    'contact_messages',
    'blog_topic_queue',
    'forum_posts',
    'forum_replies'
  )
order by tablename, policyname;
```

`public.user_document_checklist` is shared by the relocation document tracker and the Tax Prep Hub MVP. Tax Prep rows use `document_id` values prefixed with `taxprep-`.

## Edge Functions

Deploy the non-payment Edge Functions:

```bash
supabase functions deploy contact-form
supabase functions deploy send-checklist
supabase functions deploy first-month-reminders
supabase functions deploy generate-blog-post
```

Supabase provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in the Edge Function runtime. Set these secrets for launch:

```bash
supabase secrets set RESEND_API_KEY=...
supabase secrets set CONTACT_FROM_EMAIL="Frankfurt Expat Services <hello@frankfurtexpatservices.com>"
supabase secrets set CONTACT_TO_EMAIL="hello@frankfurtexpatservices.com"
supabase secrets set CHECKLIST_FROM_EMAIL="Frankfurt Expat Services <hello@frankfurtexpatservices.com>"
supabase secrets set REMINDER_FROM_EMAIL="Frankfurt Expat Services <hello@frankfurtexpatservices.com>"
```

Optional blog automation secrets:

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

Keep Contentful Delivery API variables in Netlify, not Supabase:

```bash
VITE_CONTENTFUL_SPACE_ID=...
VITE_CONTENTFUL_ACCESS_TOKEN=...
```

Optional rate-limit controls for `contact-form`:

```bash
supabase secrets set CONTACT_RATE_LIMIT_WINDOW_MINUTES=10
supabase secrets set CONTACT_RATE_LIMIT_MAX_PER_IP=5
supabase secrets set CONTACT_RATE_LIMIT_MAX_PER_EMAIL=3
```

## Reminder Emails

Schedule a daily POST to the function from Supabase scheduled functions, Netlify scheduled functions, or another trusted scheduler. The function uses the service role key from the Supabase runtime and only sends queued reminders for users who opted in.

## Smoke Test

1. Sign up with a new email and confirm it lands on `/onboarding` or `/dashboard`.
2. Submit the contact form and confirm a `contact_messages` row is stored.
3. Request the first 30 days checklist and confirm a `checklist_delivery_requests` row moves to `sent`.
4. Complete onboarding.
5. Open `/dashboard`.
6. Open `/tax-prep`, mark one tax document ready, add a note, refresh, and confirm the state persists.
7. Confirm a `user_document_checklist` row exists for the user with a `taxprep-` prefixed `document_id`.
8. Export the Tax Prep CSV and confirm it downloads.
9. If blog automation is enabled, call `generate-blog-post` once with `BLOG_GENERATION_SECRET` and confirm a Contentful draft or published entry is created from `blog_topic_queue`.
10. Toggle first-month reminders on.
11. Confirm `notification_preferences.first_month_reminders = true`.
12. Confirm `reminder_email_events` has queued rows for the user.
13. Run `first-month-reminders` manually and confirm queued events move to `sent`, `skipped`, or `failed`.

## Deployment Gate

The Supabase setup is launch-ready only when:

1. The SQL checks above return table names, not `null`.
2. The policy query returns policies for all launch tables.
3. Signup works without requiring email confirmation.
4. Contact and checklist emails either send through Resend or fail with rows stored for follow-up.
5. Reminder queueing works from the dashboard preference toggle.
6. Tax Prep Hub state persists through `user_document_checklist` and CSV export works.
7. Contentful Delivery API variables are set in Netlify if Contentful should hydrate `/blog`.
8. Blog automation is either deliberately disabled or tested with `BLOG_AUTO_PUBLISH=false`.
9. No checkout route, button, or email asks users to pay during the shelved Stripe phase.
