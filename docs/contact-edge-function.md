# Contact Form Backend Setup (Supabase)

The contact page submits to Supabase Edge Function `contact-form`.

## 1) Apply SQL schema
Use Supabase SQL editor and run the contents of:
- `src/database/contact_messages_schema.sql`

## 2) Deploy Edge Function
Function source:
- `supabase/functions/contact-form/index.ts`

Deploy:
```bash
supabase functions deploy contact-form
```

## 3) Required secrets
Set in Supabase Edge Functions secrets:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 4) Optional secrets and controls
Rate limiting:
- `CONTACT_RATE_LIMIT_WINDOW_MINUTES` (default `10`)
- `CONTACT_RATE_LIMIT_MAX_PER_IP` (default `5`)
- `CONTACT_RATE_LIMIT_MAX_PER_EMAIL` (default `3`)

Email forwarding with Resend:
- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL` (e.g. `Frankfurt Expat <noreply@yourdomain.com>`)
- `CONTACT_TO_EMAIL` (default `hello@frankfurtexpatservices.com`)

If Resend secrets are missing, the function still stores messages in DB and returns success.

## 5) Expected request body
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "General Inquiry",
  "message": "Hello...",
  "source": "contact-page"
}
```

## 6) Expected responses
Success:
```json
{ "message": "Message received" }
```

Rate-limited:
```json
{ "message": "Too many submissions. Please try again later." }
```

## Security model
- Table `public.contact_messages` has RLS enabled.
- `anon` and `authenticated` have no direct table privileges.
- Inserts are done by Edge Function using service-role key.
- Honeypot field (`website`) is silently accepted and ignored.
