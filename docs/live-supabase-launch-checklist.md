# Live Supabase Launch Checklist

Use this after every production deploy that touches auth, retention, forum, or reminder state.

## Scope

Stripe is shelved for the current traffic and directory growth phase. Do not deploy or promote these payment functions during this launch:

1. `supabase/functions/create-checkout-session`
2. `supabase/functions/create-portal-session`
3. `supabase/functions/stripe-webhook`

The live launch path is Supabase Auth, public content data, contact capture, checklist delivery, first-month reminders, forum state, and conversion tracking.

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

Quick live checks:

```sql
select to_regclass('public.notification_preferences') as notification_preferences;
select to_regclass('public.user_checklist_state') as user_checklist_state;
select to_regclass('public.user_document_checklist') as user_document_checklist;
select to_regclass('public.reminder_email_events') as reminder_email_events;
select to_regclass('public.conversion_events') as conversion_events;
select to_regclass('public.checklist_delivery_requests') as checklist_delivery_requests;
select to_regclass('public.contact_messages') as contact_messages;

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
    'forum_posts',
    'forum_replies'
  )
order by tablename, policyname;
```

## Edge Functions

Deploy the non-payment Edge Functions:

```bash
supabase functions deploy contact-form
supabase functions deploy send-checklist
supabase functions deploy first-month-reminders
```

Supabase provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in the Edge Function runtime. Set these secrets for launch:

```bash
supabase secrets set RESEND_API_KEY=...
supabase secrets set CONTACT_FROM_EMAIL="Frankfurt Expat Services <hello@frankfurtexpatservices.com>"
supabase secrets set CONTACT_TO_EMAIL="hello@frankfurtexpatservices.com"
supabase secrets set CHECKLIST_FROM_EMAIL="Frankfurt Expat Services <hello@frankfurtexpatservices.com>"
supabase secrets set REMINDER_FROM_EMAIL="Frankfurt Expat Services <hello@frankfurtexpatservices.com>"
```

Optional rate-limit controls for `contact-form`:

```bash
supabase secrets set CONTACT_RATE_LIMIT_WINDOW_MINUTES=10
supabase secrets set CONTACT_RATE_LIMIT_MAX_PER_IP=5
supabase secrets set CONTACT_RATE_LIMIT_MAX_PER_EMAIL=3
```

## Reminder Emails

Schedule a daily POST to the function from Supabase scheduled functions, Vercel Cron, or another trusted scheduler. The function uses the service role key from the Supabase runtime and only sends queued reminders for users who opted in.

## Smoke Test

1. Sign up with a new email and confirm it lands on `/onboarding` or `/dashboard`.
2. Submit the contact form and confirm a `contact_messages` row is stored.
3. Request the first 30 days checklist and confirm a `checklist_delivery_requests` row moves to `sent`.
4. Complete onboarding.
5. Open `/dashboard`.
6. Toggle first-month reminders on.
7. Confirm `notification_preferences.first_month_reminders = true`.
8. Confirm `reminder_email_events` has queued rows for the user.
9. Run `first-month-reminders` manually and confirm queued events move to `sent`, `skipped`, or `failed`.

## Deployment Gate

The Supabase setup is launch-ready only when:

1. The SQL checks above return table names, not `null`.
2. The policy query returns policies for all launch tables.
3. Signup works without requiring email confirmation.
4. Contact and checklist emails either send through Resend or fail with rows stored for follow-up.
5. Reminder queueing works from the dashboard preference toggle.
6. No checkout route, button, or email asks users to pay during the shelved Stripe phase.
